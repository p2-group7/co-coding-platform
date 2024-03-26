import type { Socket as NetSocket } from "net";
import type { Server as HTTPServer } from "http";
import type { NextApiResponse } from "next/types";
import type { Server as SocketIOServer } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import type { DefaultEventsMap } from "node_modules/socket.io/dist/typed-events";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: NetSocket & {
    server: HTTPServer & {
      io: SocketIOServer;
    };
  };
};

export type TSocket = ClientSocket<DefaultEventsMap, DefaultEventsMap>;
