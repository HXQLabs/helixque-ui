"use client";
import { Excalidraw, WelcomeScreen } from "@excalidraw/excalidraw";
import { useTheme } from "next-themes";

import "@excalidraw/excalidraw/index.css";
import Image from "next/image";

const ExcalidrawWrapper: React.FC = () => {
    const { resolvedTheme } = useTheme();

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <style>{`.excalidraw.theme--dark { --default-bg-color: #121212; }`}</style>
            <Excalidraw theme={resolvedTheme === "dark" ? "dark" : "light"}>
                <WelcomeScreen>
                    <WelcomeScreen.Center>
                        <WelcomeScreen.Center.Logo>
                            <Image
                                src="https://www.helixque.com/logo.svg"
                                alt="Helixque Logo"
                                width={60}
                                height={60}
                            />
                            <h1>Helixque Board</h1>
                        </WelcomeScreen.Center.Logo>
                        <WelcomeScreen.Center.Heading>
                            Powered By
                        </WelcomeScreen.Center.Heading>
                        <WelcomeScreen.Center.Logo />
                    </WelcomeScreen.Center>
                    <WelcomeScreen.Hints.ToolbarHint />
                    <WelcomeScreen.Hints.MenuHint />
                    <WelcomeScreen.Hints.HelpHint />
                </WelcomeScreen>

            </Excalidraw>
        </div>
    );
};

export default ExcalidrawWrapper;

