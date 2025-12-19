"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@workspace/ui/components/context-menu";
import {
  GanttCreateMarkerTrigger,
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttMarker,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
  type GanttFeature,
  type GanttStatus,
} from "@workspace/ui/components/kibo-ui/gantt";
import { EyeIcon, LinkIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

interface Meeting {
  id: string;
  title: string;
  date: Date;
  endDate: Date;
  type: "anonymous" | "exposed" | "scheduled";
  participants?: number;
  status?: "upcoming" | "completed" | "cancelled";
  timezone?: string;
  location?: string;
}

interface GanttExampleProps {
  meetings?: Meeting[];
  onSelectMeeting?: (id: string) => void;
  onRemoveMeeting?: (id: string) => void;
  onMoveMeeting?: (id: string, startAt: Date, endAt: Date | null) => void;
  onCreateMarker?: (date: Date) => void;
  className?: string;
}

export const GanttExample: React.FC<GanttExampleProps> = ({
  meetings = [],
  onSelectMeeting,
  onRemoveMeeting,
  onMoveMeeting,
  onCreateMarker,
  className,
}) => {
  const [features, setFeatures] = useState<GanttFeature[]>([]);
  const [markers, setMarkers] = useState<
    Array<{
      id: string;
      date: Date;
      label: string;
      className: string;
    }>
  >([]);

  // Define statuses for meetings
  const ganttStatuses: Record<Meeting["type"], GanttStatus> = {
    scheduled: {
      id: "scheduled",
      name: "Scheduled",
      color: "#3b82f6",
    },
    anonymous: {
      id: "anonymous",
      name: "Anonymous",
      color: "#a855f7",
    },
    exposed: {
      id: "exposed",
      name: "Exposed",
      color: "#10b981",
    },
  };

  // Convert meetings to Gantt features
  const ganttFeatures: GanttFeature[] = meetings.map((meeting) => ({
    id: meeting.id,
    name: meeting.title,
    startAt: meeting.date,
    endAt: meeting.endDate,
    status: ganttStatuses[meeting.type],
  }));

  // Group features by type
  const groupedByType = ganttFeatures.reduce(
    (acc, feature) => {
      const type =
        Object.keys(ganttStatuses).find(
          (key) => ganttStatuses[key as Meeting["type"]].id === feature.status.id
        ) || "scheduled";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(feature);
      return acc;
    },
    {} as Record<string, GanttFeature[]>
  );

  const sortedGroupedMeetings = Object.fromEntries(
    Object.entries(groupedByType).sort(([nameA], [nameB]) =>
      nameA.localeCompare(nameB)
    )
  );

  const handleViewMeeting = (id: string) => {
    console.log(`Meeting selected: ${id}`);
    onSelectMeeting?.(id);
  };

  const handleCopyLink = (id: string) => {
    console.log(`Copy link: ${id}`);
  };

  const handleRemoveMeeting = (id: string) => {
    console.log(`Remove meeting: ${id}`);
    onRemoveMeeting?.(id);
  };

  const handleRemoveMarker = (id: string) => {
    console.log(`Remove marker: ${id}`);
    setMarkers((prev) => prev.filter((marker) => marker.id !== id));
  };

  const handleCreateMarker = (date: Date) => {
    console.log(`Create marker: ${date.toISOString()}`);
    const newMarker = {
      id: `marker-${Date.now()}`,
      date,
      label: "Milestone",
      className: "bg-blue-100 text-blue-900",
    };
    setMarkers((prev) => [...prev, newMarker]);
    onCreateMarker?.(date);
  };

  const handleMoveMeeting = (id: string, startAt: Date, endAt: Date | null) => {
    if (!endAt) {
      return;
    }
    console.log(`Move meeting: ${id} from ${startAt} to ${endAt}`);
    onMoveMeeting?.(id, startAt, endAt);
  };

  const handleAddMeeting = (date: Date) => {
    console.log(`Add meeting: ${date.toISOString()}`);
  };

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      scheduled: "Scheduled Meetings",
      exposed: "Exposed Meetings",
      anonymous: "Anonymous Meetings",
    };
    return labels[type] || type;
  };

  return (
    <GanttProvider
      onAddItem={handleAddMeeting}
      range="monthly"
      zoom={35}
      className={`${className} flex h-full max-h-full overflow-hidden`}
    >
      <GanttSidebar className="w-36 flex-shrink-0 border-r border-border/50">
        {Object.entries(sortedGroupedMeetings).map(([type, meetingList]) => (
          <GanttSidebarGroup key={type} name={getTypeLabel(type)}>
            {meetingList.map((meeting) => (
              <GanttSidebarItem
                key={meeting.id}
                feature={meeting}
                onSelectItem={() => handleViewMeeting(meeting.id)}
              />
            ))}
          </GanttSidebarGroup>
        ))}
      </GanttSidebar>

      <GanttTimeline className="flex-1 min-w-0 overflow-auto">
        <GanttHeader />
        <GanttFeatureList className="min-h-[200px]">
          {Object.entries(sortedGroupedMeetings).map(([type, meetingList]) => (
            <GanttFeatureListGroup key={type}>
              {meetingList.map((meeting) => (
                <div className="flex h-10" key={meeting.id}>
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      <button
                        type="button"
                        onClick={() => handleViewMeeting(meeting.id)}
                        className="flex-1"
                      >
                        <GanttFeatureItem
                          onMove={handleMoveMeeting}
                          {...meeting}
                        >
                          <p className="flex-1 truncate text-xs">
                            {meeting.name}
                          </p>
                        </GanttFeatureItem>
                      </button>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        className="flex items-center gap-2"
                        onClick={() => handleViewMeeting(meeting.id)}
                      >
                        <EyeIcon className="text-muted-foreground" size={16} />
                        View meeting
                      </ContextMenuItem>
                      <ContextMenuItem
                        className="flex items-center gap-2"
                        onClick={() => handleCopyLink(meeting.id)}
                      >
                        <LinkIcon
                          className="text-muted-foreground"
                          size={16}
                        />
                        Copy link
                      </ContextMenuItem>
                      <ContextMenuItem
                        className="flex items-center gap-2 text-destructive"
                        onClick={() => handleRemoveMeeting(meeting.id)}
                      >
                        <TrashIcon size={16} />
                        Remove meeting
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </div>
              ))}
            </GanttFeatureListGroup>
          ))}
        </GanttFeatureList>

        {markers.map((marker) => (
          <GanttMarker
            key={marker.id}
            {...marker}
            onRemove={handleRemoveMarker}
          />
        ))}

        <GanttToday />
        <GanttCreateMarkerTrigger onCreateMarker={handleCreateMarker} />
      </GanttTimeline>
    </GanttProvider>
  );
};
