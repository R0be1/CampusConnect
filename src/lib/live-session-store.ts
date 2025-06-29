
'use server';

// NOTE: This is a simple in-memory store for demonstration purposes.
// In a production application, you would use a real-time database (like Firebase Realtime Database)
// or a WebSocket-based solution for this functionality.
// This store will reset every time the server restarts.

export type Participant = {
  id: string; // studentId
  name: string;
  handRaised: boolean;
};

export type Message = {
  id: string; // uuid
  from: string; // participant name
  text: string;
  timestamp: number;
};

export type SessionState = {
  participants: Participant[];
  messages: Message[];
  teacherStreams: {
    cameraOn: boolean;
    screenOn: boolean;
  };
};

const sessionStore = new Map<string, SessionState>();

function getSession(sessionId: string): SessionState {
  if (!sessionStore.has(sessionId)) {
    sessionStore.set(sessionId, {
      participants: [],
      messages: [],
      teacherStreams: { cameraOn: false, screenOn: false },
    });
  }
  return sessionStore.get(sessionId)!;
}

export async function getSessionState(sessionId: string) {
  return getSession(sessionId);
}

export async function joinSession(sessionId: string, studentId: string, studentName: string) {
  const session = getSession(sessionId);
  if (!session.participants.find(p => p.id === studentId)) {
    session.participants.push({ id: studentId, name: studentName, handRaised: false });
  }
  return session;
}

export async function leaveSession(sessionId: string, studentId: string) {
  const session = getSession(sessionId);
  session.participants = session.participants.filter(p => p.id !== studentId);
  return session;
}

export async function toggleHand(sessionId: string, studentId: string, raised: boolean) {
    const session = getSession(sessionId);
    const participant = session.participants.find(p => p.id === studentId);
    if (participant) {
        participant.handRaised = raised;
    }
    return session;
}

export async function addMessage(sessionId: string, from: string, text: string) {
    const session = getSession(sessionId);
    session.messages.push({
        id: crypto.randomUUID(),
        from,
        text,
        timestamp: Date.now(),
    });
    // Keep only the last 50 messages
    if(session.messages.length > 50) {
        session.messages.splice(0, session.messages.length - 50);
    }
    return session;
}

export async function setCameraState(sessionId: string, isOn: boolean) {
    const session = getSession(sessionId);
    session.teacherStreams.cameraOn = isOn;
    return session;
}

export async function setScreenState(sessionId: string, isOn: boolean) {
    const session = getSession(sessionId);
    session.teacherStreams.screenOn = isOn;
    return session;
}
