import { createTRPCRouter, publicProcedure } from "../trpc";

import {
  IngressAudioEncodingPreset,
  IngressInput,
  IngressVideoEncodingPreset,
  TrackSource,
  IngressVideoEncodingOptions
} from "livekit-server-sdk";
import { z } from "zod";
import { VideoCodec, VideoQuality } from "livekit-server-sdk/dist/proto/livekit_models";

export const ingressRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        roomSlug: z
          .string()
          .regex(/^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/)
          .min(3),
        streamerName: z.string().min(3),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { ingressClient } = ctx;

      const ingress = await ingressClient.createIngress(
        IngressInput.RTMP_INPUT,
        {
          name: input.roomSlug,
          roomName: input.roomSlug,
          participantName: input.streamerName,
          participantIdentity: input.roomSlug,
          video: {
            preset: IngressVideoEncodingPreset.H264_1080P_30FPS_1_LAYER,
          },
        }
      );

      return ingress;
    }),

  deleteAll: publicProcedure.mutation(async ({ ctx }) => {
    const { ingressClient } = ctx;
    const ingresses = await ingressClient.listIngress();

    for (const ingress of ingresses) {
      if (ingress.ingressId) {
        await ingressClient.deleteIngress(ingress.ingressId);
      }
    }
  }),
});
