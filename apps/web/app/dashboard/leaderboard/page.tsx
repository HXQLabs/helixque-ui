"use client";

import * as React from "react";
import {
  Trophy,
  Medal,
  Star,
  TrendingUp,
  Crown,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";

// Mock Data
type User = { id: number; name: string; role: string; points: number; avatar: string; streak: number };
const LEADERBOARD_DATA: User[] = [
  { id: 1, name: "Alice Johnson", role: "Frontend Guru", points: 2450, avatar: "https://avatar.vercel.sh/alice", streak: 12 },
  { id: 2, name: "Bob Smith", role: "Backend Wizard", points: 2100, avatar: "https://avatar.vercel.sh/bob", streak: 8 },
  { id: 3, name: "Charlie Kim", role: "AI Researcher", points: 1950, avatar: "https://avatar.vercel.sh/charlie", streak: 5 },
  { id: 4, name: "Diana Prince", role: "Product Designer", points: 1800, avatar: "https://avatar.vercel.sh/diana", streak: 3 },
  { id: 5, name: "Ethan Hunt", role: "Security Analyst", points: 1650, avatar: "https://avatar.vercel.sh/ethan", streak: 15 },
  { id: 6, name: "Fiona Gallagher", role: "Full Stack Dev", points: 1400, avatar: "https://avatar.vercel.sh/fiona", streak: 2 },
  { id: 7, name: "George Martin", role: "Technical Writer", points: 1200, avatar: "https://avatar.vercel.sh/george", streak: 0 },
];

export default function LeaderboardPage() {

  const others = LEADERBOARD_DATA.slice(3);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Community Leaderboard</h1>
        <p className="text-muted-foreground">
          Top contributors making an impact through mentorship and collaboration.
        </p>
      </div>

      {/* Podium Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mt-4 mb-8">
        {/* 2nd Place */}
        {LEADERBOARD_DATA[1] && (
        <Card className="bg-muted/50 border-none order-2 md:order-1 relative mt-8 md:mt-0">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Medal className="h-8 w-8 text-slate-400" />
            </div>
            <CardHeader className="text-center pb-2 pt-8">
                <Avatar className="h-20 w-20 mx-auto border-4 border-slate-400">
                    <AvatarImage src={LEADERBOARD_DATA[1].avatar} />
                    <AvatarFallback>2</AvatarFallback>
                </Avatar>
                <CardTitle className="mt-2">{LEADERBOARD_DATA[1].name}</CardTitle>
                <p className="text-sm text-muted-foreground">{LEADERBOARD_DATA[1].role}</p>
            </CardHeader>
             <CardContent className="text-center font-bold text-2xl text-primary">
                {LEADERBOARD_DATA[1].points} pts
            </CardContent>
        </Card>
        )}

        {/* 1st Place */}
         {LEADERBOARD_DATA[0] && (
         <Card className="bg-yellow-500/10 border-yellow-500/50 order-1 md:order-2 relative transform md:-translate-y-4">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <Crown className="h-10 w-10 text-yellow-500 fill-yellow-500" />
            </div>
             <CardHeader className="text-center pb-2 pt-10">
                <Avatar className="h-24 w-24 mx-auto border-4 border-yellow-500">
                    <AvatarImage src={LEADERBOARD_DATA[0].avatar} />
                    <AvatarFallback>1</AvatarFallback>
                </Avatar>
                <CardTitle className="mt-2 text-xl">{LEADERBOARD_DATA[0].name}</CardTitle>
                <p className="text-sm text-muted-foreground">{LEADERBOARD_DATA[0].role}</p>
            </CardHeader>
            <CardContent className="text-center font-bold text-3xl text-yellow-500">
                {LEADERBOARD_DATA[0].points} pts
            </CardContent>
        </Card>
        )}

        {/* 3rd Place */}
        {LEADERBOARD_DATA[2] && (
        <Card className="bg-muted/50 border-none order-3 relative mt-8 md:mt-0">
             <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Medal className="h-8 w-8 text-amber-600" />
            </div>
            <CardHeader className="text-center pb-2 pt-8">
                <Avatar className="h-20 w-20 mx-auto border-4 border-amber-600">
                    <AvatarImage src={LEADERBOARD_DATA[2].avatar} />
                    <AvatarFallback>3</AvatarFallback>
                </Avatar>
                <CardTitle className="mt-2">{LEADERBOARD_DATA[2].name}</CardTitle>
                <p className="text-sm text-muted-foreground">{LEADERBOARD_DATA[2].role}</p>
            </CardHeader>
            <CardContent className="text-center font-bold text-2xl text-primary">
                {LEADERBOARD_DATA[2].points} pts
            </CardContent>
        </Card>
        )}
      </div>

      {/* Rankings List */}
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Rankings
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm text-left">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[80px]">Rank</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">User</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground hidden md:table-cell">Role</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center">Streak</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Points</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {others.map((user, index) => (
                            <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <td className="p-4 align-middle font-medium text-lg text-muted-foreground">#{index + 4}</td>
                                <td className="p-4 align-middle">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{user.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 align-middle hidden md:table-cell text-muted-foreground">{user.role}</td>
                                <td className="p-4 align-middle text-center">
                                    {user.streak > 3 && (
                                        <Badge variant="secondary">🔥 {user.streak} days</Badge>
                                    )}
                                </td>
                                <td className="p-4 align-middle text-right font-bold">{user.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
