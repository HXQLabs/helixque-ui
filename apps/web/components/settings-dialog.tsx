"use client";

import * as React from "react";
import {
  Bell,
  Check,
  Globe,
  Home,
  Keyboard,
  Link,
  Lock,
  Menu,
  MessageCircle,
  Paintbrush,
  Settings,
  Video,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";

const data = {
  nav: [
    { name: "Notifications", icon: Bell },
    { name: "Navigation", icon: Menu },
    { name: "Home", icon: Home },
    { name: "Appearance", icon: Paintbrush },
    { name: "Messages & media", icon: MessageCircle },
    { name: "Language & region", icon: Globe },
    { name: "Accessibility", icon: Keyboard },
    { name: "Mark as read", icon: Check },
    { name: "Audio & video", icon: Video },
    { name: "Connected accounts", icon: Link },
    { name: "Privacy & visibility", icon: Lock },
    { name: "Advanced", icon: Settings },
  ],
};

// Initial states for each setting
export type NotificationsState = {
  emailNotif: boolean;
  pushNotif: boolean;
  smsNotif: boolean;
};
export type NavigationState = {
  navStyle: string;
  showIcons: boolean;
};
export type HomeState = {
  homepage: string;
  showGreeting: boolean;
  itemsPerPage: string;
};
export type AppearanceState = {
  theme: string;
  compactMode: boolean;
};
export type MessagesMediaState = {
  autoPlay: boolean;
  imageQuality: string;
  enableGifs: boolean;
};
export type LanguageRegionState = {
  language: string;
  region: string;
  timezone: string;
};
export type AccessibilityState = {
  reduceMotion: boolean;
  highContrast: boolean;
  fontSize: string;
  screenReader: boolean;
};
export type MarkAsReadState = {
  readBehavior: string;
  readOnClick: boolean;
};
export type AudioVideoState = {
  videoQuality: string;
  audioOutput: string;
  videoCaptions: boolean;
  microphone: string;
};
export type PrivacyVisibilityState = {
  profileVisibility: string;
  showActivity: boolean;
  allowMessages: boolean;
};
export type AdvancedState = {
  betaFeatures: boolean;
  logLevel: string;
};
const initialStates = {
  Notifications: {
    emailNotif: true,
    pushNotif: true,
    smsNotif: false,
  },
  Navigation: {
    navStyle: "compact",
    showIcons: true,
  },
  Home: {
    homepage: "Dashboard",
    showGreeting: true,
    itemsPerPage: "10",
  },
  Appearance: {
    theme: "dark",
    compactMode: false,
  },
  "Messages & media": {
    autoPlay: true,
    imageQuality: "High",
    enableGifs: true,
  },
  "Language & region": {
    language: "English",
    region: "United States",
    timezone: "UTC-8 (PST)",
  },
  Accessibility: {
    reduceMotion: false,
    highContrast: false,
    fontSize: "Medium",
    screenReader: true,
  },
  "Mark as read": {
    readBehavior: "manual",
    readOnClick: true,
  },
  "Audio & video": {
    videoQuality: "720p",
    audioOutput: "Default",
    videoCaptions: true,
    microphone: "Default",
  },
  "Connected accounts": {},
  "Privacy & visibility": {
    profileVisibility: "public",
    showActivity: true,
    allowMessages: true,
  },
  Advanced: {
    betaFeatures: false,
    logLevel: "Warning",
  },
};

// Settings Content Components
function NotificationsSettings({
  state,
  setState,
}: {
  state: NotificationsState;
  setState: (s: NotificationsState) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
        <Label htmlFor="email-notif" className="font-medium cursor-pointer">
          Email Notifications
        </Label>
        <input
          type="checkbox"
          id="email-notif"
          checked={state.emailNotif}
          onChange={(e) => setState({ ...state, emailNotif: e.target.checked })}
          className="w-4 h-4 accent-primary"
        />
      </div>
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
        <Label htmlFor="push-notif" className="font-medium cursor-pointer">
          Push Notifications
        </Label>
        <input
          type="checkbox"
          id="push-notif"
          checked={state.pushNotif}
          onChange={(e) => setState({ ...state, pushNotif: e.target.checked })}
          className="w-4 h-4 accent-primary"
        />
      </div>
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
        <Label htmlFor="sms-notif" className="font-medium cursor-pointer">
          SMS Notifications
        </Label>
        <input
          type="checkbox"
          id="sms-notif"
          checked={state.smsNotif}
          onChange={(e) => setState({ ...state, smsNotif: e.target.checked })}
          className="w-4 h-4 accent-primary"
        />
      </div>
    </div>
  );
}

function NavigationSettings({
  state,
  setState,
}: {
  state: NavigationState;
  setState: (s: NavigationState) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label className="mb-3 block font-medium">Navigation Style</Label>
        <div className="space-y-3">
          <label className="flex items-center p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/40 transition-colors">
            <input
              type="radio"
              name="nav-style"
              checked={state.navStyle === "compact"}
              onChange={() => setState({ ...state, navStyle: "compact" })}
              className="w-4 h-4 accent-primary"
            />
            <span className="ml-3 font-medium">Compact</span>
          </label>
          <label className="flex items-center p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/40 transition-colors">
            <input
              type="radio"
              name="nav-style"
              checked={state.navStyle === "expanded"}
              onChange={() => setState({ ...state, navStyle: "expanded" })}
              className="w-4 h-4 accent-primary"
            />
            <span className="ml-3 font-medium">Expanded</span>
          </label>
        </div>
      </div>
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
        <Label htmlFor="show-icons" className="font-medium cursor-pointer">
          Show Icons
        </Label>
        <input
          type="checkbox"
          id="show-icons"
          checked={state.showIcons}
          onChange={(e) => setState({ ...state, showIcons: e.target.checked })}
          className="w-4 h-4 accent-primary"
        />
      </div>
    </div>
  );
}

function HomeSettings({
  state,
  setState,
}: {
  state: HomeState;
  setState: (s: HomeState) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="homepage" className="mb-2.5 block font-medium">
          Homepage
        </Label>
        <select
          id="homepage"
          value={state.homepage}
          onChange={(e) => setState({ ...state, homepage: e.target.value })}
          className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option>Dashboard</option>
          <option>Explore</option>
          <option>Trending</option>
        </select>
      </div>
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
        <Label htmlFor="show-greeting" className="font-medium cursor-pointer">
          Show Greeting
        </Label>
        <input
          type="checkbox"
          id="show-greeting"
          checked={state.showGreeting}
          onChange={(e) =>
            setState({ ...state, showGreeting: e.target.checked })
          }
          className="w-4 h-4 accent-primary"
        />
      </div>
      <div>
        <Label htmlFor="items-per-page" className="mb-2.5 block font-medium">
          Items Per Page
        </Label>
        <Input
          id="items-per-page"
          type="number"
          value={state.itemsPerPage}
          onChange={(e) => setState({ ...state, itemsPerPage: e.target.value })}
          min="5"
          max="50"
          className="text-sm font-medium"
        />
      </div>
    </div>
  );
}

function AppearanceSettings({
  state,
  setState,
}: {
  state: AppearanceState;
  setState: (s: AppearanceState) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label className="mb-3 block font-medium">Theme</Label>
        <div className="space-y-3">
          <label className="flex items-center p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/40 transition-colors">
            <input
              type="radio"
              name="theme"
              checked={state.theme === "light"}
              onChange={() => setState({ ...state, theme: "light" })}
              className="w-4 h-4 accent-primary"
            />
            <span className="ml-3 font-medium">Light</span>
          </label>
          <label className="flex items-center p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/40 transition-colors">
            <input
              type="radio"
              name="theme"
              checked={state.theme === "dark"}
              onChange={() => setState({ ...state, theme: "dark" })}
              className="w-4 h-4 accent-primary"
            />
            <span className="ml-3 font-medium">Dark</span>
          </label>
          <label className="flex items-center p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/40 transition-colors">
            <input
              type="radio"
              name="theme"
              checked={state.theme === "system"}
              onChange={() => setState({ ...state, theme: "system" })}
              className="w-4 h-4 accent-primary"
            />
            <span className="ml-3 font-medium">System</span>
          </label>
        </div>
      </div>
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
        <Label htmlFor="compact-mode" className="font-medium cursor-pointer">
          Compact Mode
        </Label>
        <input
          type="checkbox"
          id="compact-mode"
          checked={state.compactMode}
          onChange={(e) =>
            setState({ ...state, compactMode: e.target.checked })
          }
          className="w-4 h-4 accent-primary"
        />
      </div>
    </div>
  );
}

function MessagesMediaSettings({
  state,
  setState,
}: {
  state: MessagesMediaState;
  setState: (s: MessagesMediaState) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
        <Label htmlFor="auto-play" className="font-medium cursor-pointer">
          Auto-play Media
        </Label>
        <input
          type="checkbox"
          id="auto-play"
          checked={state.autoPlay}
          onChange={(e) => setState({ ...state, autoPlay: e.target.checked })}
          className="w-4 h-4 accent-primary"
        />
      </div>
      <div>
        <Label htmlFor="image-quality" className="mb-2.5 block font-medium">
          Image Quality
        </Label>
        <select
          id="image-quality"
          value={state.imageQuality}
          onChange={(e) => setState({ ...state, imageQuality: e.target.value })}
          className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
        <Label htmlFor="enable-gifs" className="font-medium cursor-pointer">
          Enable GIFs
        </Label>
        <input
          type="checkbox"
          id="enable-gifs"
          checked={state.enableGifs}
          onChange={(e) => setState({ ...state, enableGifs: e.target.checked })}
          className="w-4 h-4 accent-primary"
        />
      </div>
    </div>
  );
}

function LanguageRegionSettings({
  state,
  setState,
}: {
  state: LanguageRegionState;
  setState: (s: LanguageRegionState) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="language" className="mb-2.5 block font-medium">
          Language
        </Label>
        <select
          id="language"
          value={state.language}
          onChange={(e) => setState({ ...state, language: e.target.value })}
          className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
          <option>German</option>
          <option>Japanese</option>
        </select>
      </div>
      <div>
        <Label htmlFor="region" className="mb-2.5 block font-medium">
          Region
        </Label>
        <select
          id="region"
          value={state.region}
          onChange={(e) => setState({ ...state, region: e.target.value })}
          className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option>United States</option>
          <option>United Kingdom</option>
          <option>Canada</option>
          <option>Australia</option>
          <option>Germany</option>
        </select>
      </div>
      <div>
        <Label htmlFor="timezone" className="mb-2.5 block font-medium">
          Timezone
        </Label>
        <select
          id="timezone"
          value={state.timezone}
          onChange={(e) => setState({ ...state, timezone: e.target.value })}
          className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option>UTC-8 (PST)</option>
          <option>UTC-5 (EST)</option>
          <option>UTC (GMT)</option>
          <option>UTC+1 (CET)</option>
          <option>UTC+9 (JST)</option>
        </select>
      </div>
    </div>
  );
}

function AccessibilitySettings({
  state,
  setState,
}: {
  state: AccessibilityState;
  setState: (s: AccessibilityState) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
        <Label htmlFor="reduce-motion" className="font-medium cursor-pointer">
          Reduce Motion
        </Label>
        <input
          type="checkbox"
          id="reduce-motion"
          checked={state.reduceMotion}
          onChange={(e) =>
            setState({ ...state, reduceMotion: e.target.checked })
          }
          className="w-4 h-4 accent-primary"
        />
      </div>
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
        <Label htmlFor="high-contrast" className="font-medium cursor-pointer">
          High Contrast
        </Label>
        <input
          type="checkbox"
          id="high-contrast"
          checked={state.highContrast}
          onChange={(e) =>
            setState({ ...state, highContrast: e.target.checked })
          }
          className="w-4 h-4 accent-primary"
        />
      </div>
      <div>
        <Label htmlFor="font-size" className="mb-2.5 block font-medium">
          Font Size
        </Label>
        <select
          id="font-size"
          value={state.fontSize}
          onChange={(e) => setState({ ...state, fontSize: e.target.value })}
          className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option>Small</option>
          <option>Medium</option>
          <option>Large</option>
          <option>Extra Large</option>
        </select>
      </div>
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
        <Label htmlFor="screen-reader" className="font-medium cursor-pointer">
          Screen Reader Support
        </Label>
        <input
          type="checkbox"
          id="screen-reader"
          checked={state.screenReader}
          onChange={(e) =>
            setState({ ...state, screenReader: e.target.checked })
          }
          className="w-4 h-4 accent-primary"
        />
      </div>
    </div>
  );
}

function MarkAsReadSettings({
  state,
  setState,
}: {
  state: MarkAsReadState;
  setState: (s: MarkAsReadState) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label className="mb-3 block font-medium">Mark as Read Behavior</Label>
        <div className="space-y-3">
          <label className="flex items-center p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/40 transition-colors">
            <input
              type="radio"
              name="read-behavior"
              checked={state.readBehavior === "manual"}
              onChange={() => setState({ ...state, readBehavior: "manual" })}
              className="w-4 h-4 accent-primary"
            />
            <span className="ml-3 font-medium">Manual</span>
          </label>
          <label className="flex items-center p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/40 transition-colors">
            <input
              type="radio"
              name="read-behavior"
              checked={state.readBehavior === "auto"}
              onChange={() => setState({ ...state, readBehavior: "auto" })}
              className="w-4 h-4 accent-primary"
            />
            <span className="ml-3 font-medium">Automatic</span>
          </label>
        </div>
      </div>
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
        <Label htmlFor="read-on-click" className="font-medium cursor-pointer">
          Mark Read on Click
        </Label>
        <input
          type="checkbox"
          id="read-on-click"
          checked={state.readOnClick}
          onChange={(e) =>
            setState({ ...state, readOnClick: e.target.checked })
          }
          className="w-4 h-4 accent-primary"
        />
      </div>
    </div>
  );
}

function AudioVideoSettings({
  state,
  setState,
}: {
  state: AudioVideoState;
  setState: (s: AudioVideoState) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="video-quality" className="mb-2.5 block font-medium">
          Video Quality
        </Label>
        <select
          id="video-quality"
          value={state.videoQuality}
          onChange={(e) => setState({ ...state, videoQuality: e.target.value })}
          className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option>360p</option>
          <option>480p</option>
          <option>720p</option>
          <option>1080p</option>
        </select>
      </div>
      <div>
        <Label htmlFor="audio-output" className="mb-2.5 block font-medium">
          Audio Output
        </Label>
        <select
          id="audio-output"
          value={state.audioOutput}
          onChange={(e) => setState({ ...state, audioOutput: e.target.value })}
          className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option>Default</option>
          <option>Speaker</option>
          <option>Headphones</option>
        </select>
      </div>
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
        <Label htmlFor="video-captions" className="font-medium cursor-pointer">
          Video Captions
        </Label>
        <input
          type="checkbox"
          id="video-captions"
          checked={state.videoCaptions}
          onChange={(e) =>
            setState({ ...state, videoCaptions: e.target.checked })
          }
          className="w-4 h-4 accent-primary"
        />
      </div>
      <div>
        <Label htmlFor="microphone" className="mb-2.5 block font-medium">
          Microphone
        </Label>
        <select
          id="microphone"
          value={state.microphone}
          onChange={(e) => setState({ ...state, microphone: e.target.value })}
          className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option>Default</option>
          <option>Built-in Microphone</option>
          <option>External Microphone</option>
        </select>
      </div>
    </div>
  );
}

function ConnectedAccountsSettings() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
        <div>
          <p className="font-semibold text-sm">Google</p>
          <p className="text-xs text-muted-foreground mt-1">user@gmail.com</p>
        </div>
        <Button variant="outline" size="sm" className="font-medium">
          Disconnect
        </Button>
      </div>
      <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
        <div>
          <p className="font-semibold text-sm">GitHub</p>
          <p className="text-xs text-muted-foreground mt-1">Not connected</p>
        </div>
        <Button size="sm" className="font-medium">
          Connect
        </Button>
      </div>
      <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
        <div>
          <p className="font-semibold text-sm">Discord</p>
          <p className="text-xs text-muted-foreground mt-1">Not connected</p>
        </div>
        <Button size="sm" className="font-medium">
          Connect
        </Button>
      </div>
    </div>
  );
}

function PrivacyVisibilitySettings({
  state,
  setState,
}: {
  state: PrivacyVisibilityState;
  setState: (s: PrivacyVisibilityState) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label className="mb-3 block font-medium">Profile Visibility</Label>
        <div className="space-y-3">
          <label className="flex items-center p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/40 transition-colors">
            <input
              type="radio"
              name="visibility"
              checked={state.profileVisibility === "public"}
              onChange={() =>
                setState({ ...state, profileVisibility: "public" })
              }
              className="w-4 h-4 accent-primary"
            />
            <span className="ml-3 font-medium">Public</span>
          </label>
          <label className="flex items-center p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/40 transition-colors">
            <input
              type="radio"
              name="visibility"
              checked={state.profileVisibility === "friends"}
              onChange={() =>
                setState({ ...state, profileVisibility: "friends" })
              }
              className="w-4 h-4 accent-primary"
            />
            <span className="ml-3 font-medium">Friends Only</span>
          </label>
          <label className="flex items-center p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/40 transition-colors">
            <input
              type="radio"
              name="visibility"
              checked={state.profileVisibility === "private"}
              onChange={() =>
                setState({ ...state, profileVisibility: "private" })
              }
              className="w-4 h-4 accent-primary"
            />
            <span className="ml-3 font-medium">Private</span>
          </label>
        </div>
      </div>
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
        <Label htmlFor="show-activity" className="font-medium cursor-pointer">
          Show Activity Status
        </Label>
        <input
          type="checkbox"
          id="show-activity"
          checked={state.showActivity}
          onChange={(e) =>
            setState({ ...state, showActivity: e.target.checked })
          }
          className="w-4 h-4 accent-primary"
        />
      </div>
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
        <Label htmlFor="allow-messages" className="font-medium cursor-pointer">
          Allow Messages from Anyone
        </Label>
        <input
          type="checkbox"
          id="allow-messages"
          checked={state.allowMessages}
          onChange={(e) =>
            setState({ ...state, allowMessages: e.target.checked })
          }
          className="w-4 h-4 accent-primary"
        />
      </div>
    </div>
  );
}

function AdvancedSettings({
  state,
  setState,
}: {
  state: AdvancedState;
  setState: (s: AdvancedState) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
        <Label htmlFor="beta-features" className="font-medium cursor-pointer">
          Beta Features
        </Label>
        <input
          type="checkbox"
          id="beta-features"
          checked={state.betaFeatures}
          onChange={(e) =>
            setState({ ...state, betaFeatures: e.target.checked })
          }
          className="w-4 h-4 accent-primary"
        />
      </div>
      <div>
        <Label htmlFor="log-level" className="mb-2.5 block font-medium">
          Log Level
        </Label>
        <select
          id="log-level"
          value={state.logLevel}
          onChange={(e) => setState({ ...state, logLevel: e.target.value })}
          className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option>Error</option>
          <option>Warning</option>
          <option>Info</option>
          <option>Debug</option>
        </select>
      </div>
    </div>
  );
}

const settingsContent: Record<string, (props: any) => React.ReactNode> = {
  Notifications: NotificationsSettings,
  Navigation: NavigationSettings,
  Home: HomeSettings,
  Appearance: AppearanceSettings,
  "Messages & media": MessagesMediaSettings,
  "Language & region": LanguageRegionSettings,
  Accessibility: AccessibilitySettings,
  "Mark as read": MarkAsReadSettings,
  "Audio & video": AudioVideoSettings,
  "Connected accounts": ConnectedAccountsSettings,
  "Privacy & visibility": PrivacyVisibilitySettings,
  Advanced: AdvancedSettings,
};

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [activeSection, setActiveSection] = React.useState("Notifications");
  const [states, setStates] = React.useState(initialStates);
  const [hasChanges, setHasChanges] = React.useState(false);

  const currentState = React.useMemo(
    () => states[activeSection as keyof typeof states] || {},
    [states, activeSection],
  );
  const initialState = React.useMemo(
    () => initialStates[activeSection as keyof typeof initialStates] || {},
    [activeSection],
  );

  // Check if current state has changes from initial state
  React.useEffect(() => {
    const changed =
      JSON.stringify(currentState) !== JSON.stringify(initialState);
    setHasChanges(changed);
  }, [currentState, initialState]);

  const handleStateChange = (newState: any) => {
    setStates({
      ...states,
      [activeSection]: newState,
    });
  };

  const handleSave = () => {
    // Save logic here
    console.log(
      "Settings saved:",
      states[activeSection as keyof typeof states],
    );
    setHasChanges(false);
  };

  const handleDiscard = () => {
    // Reset to initial state
    setStates({
      ...states,
      [activeSection]: initialState,
    });
  };

  const ContentComponent = settingsContent[activeSection];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          isActive={item.name === activeSection}
                          onClick={() => setActiveSection(item.name)}
                        >
                          <item.icon />
                          <span>{item.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-5">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{activeSection}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex-1 overflow-y-auto px-5 pt-5">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1">
                    {activeSection}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Configure your {activeSection.toLowerCase()} preferences.
                  </p>
                </div>
                {ContentComponent && (
                  <ContentComponent
                    state={currentState}
                    setState={handleStateChange}
                    hasChanges={hasChanges}
                  />
                )}
              </div>
            </div>
            {hasChanges && (
              <div className="shrink-0 border-t px-5 py-4 mt-2">
                <div className="flex items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDiscard}
                    className="font-medium"
                  >
                    Discard
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="font-medium"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
