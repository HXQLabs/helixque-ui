"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  type ReactNode,
} from "react";

interface CallContextType {
  isInCall: boolean;
  setIsInCall: (value: boolean) => void;
  callVideoOn: boolean;
  setCallVideoOn: (value: boolean) => void;
  callMicOn: boolean;
  setCallMicOn: (value: boolean) => void;
  /** Store the MediaStream so it persists across route changes */
  streamRef: React.MutableRefObject<MediaStream | null>;
}

const CallContext = createContext<CallContextType>({
  isInCall: false,
  setIsInCall: () => {},
  callVideoOn: false,
  setCallVideoOn: () => {},
  callMicOn: false,
  setCallMicOn: () => {},
  streamRef: { current: null },
});

export function CallProvider({ children }: { children: ReactNode }) {
  const [isInCall, setIsInCall] = useState(false);
  const [callVideoOn, setCallVideoOn] = useState(false);
  const [callMicOn, setCallMicOn] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  return (
    <CallContext.Provider
      value={{
        isInCall,
        setIsInCall,
        callVideoOn,
        setCallVideoOn,
        callMicOn,
        setCallMicOn,
        streamRef,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

export function useCall() {
  return useContext(CallContext);
}
