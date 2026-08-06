
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  ScriptGoogleMaps: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMaps.vue")['default']
  ScriptGoogleMapsAdvancedMarkerElement: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsAdvancedMarkerElement.vue")['default']
  ScriptGoogleMapsCircle: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsCircle.vue")['default']
  ScriptGoogleMapsGeoJson: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsGeoJson.vue")['default']
  ScriptGoogleMapsHeatmapLayer: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsHeatmapLayer.vue")['default']
  ScriptGoogleMapsInfoWindow: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsInfoWindow.vue")['default']
  ScriptGoogleMapsMarker: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsMarker.vue")['default']
  ScriptGoogleMapsMarkerClusterer: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsMarkerClusterer.vue")['default']
  ScriptGoogleMapsOverlayView: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsOverlayView.vue")['default']
  ScriptGoogleMapsPinElement: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsPinElement.vue")['default']
  ScriptGoogleMapsPolygon: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsPolygon.vue")['default']
  ScriptGoogleMapsPolyline: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsPolyline.vue")['default']
  ScriptGoogleMapsRectangle: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsRectangle.vue")['default']
  ScriptGoogleMapsStaticMap: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsStaticMap.vue")['default']
  BindGoogleMapsEvents: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/bindGoogleMapsEvents")['default']
  InjectionKeys: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/injectionKeys")['default']
  Types: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/types")['default']
  UseGoogleMapsResource: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/useGoogleMapsResource")['default']
  ScriptAriaLoadingIndicator: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptAriaLoadingIndicator.vue")['default']
  ScriptBlueskyEmbed: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptBlueskyEmbed.vue")['default']
  ScriptCalendlyInlineWidget: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptCalendlyInlineWidget.vue")['default']
  ScriptCarbonAds: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptCarbonAds.vue")['default']
  ScriptCrisp: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptCrisp.vue")['default']
  ScriptGoogleAdsense: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptGoogleAdsense.vue")['default']
  ScriptGravatar: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptGravatar.vue")['default']
  ScriptInstagramEmbed: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptInstagramEmbed.vue")['default']
  ScriptIntercom: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptIntercom.vue")['default']
  ScriptLemonSqueezy: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptLemonSqueezy.vue")['default']
  ScriptLoadingIndicator: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptLoadingIndicator.vue")['default']
  ScriptPayPalButtons: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptPayPalButtons.vue")['default']
  ScriptPayPalMessages: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptPayPalMessages.vue")['default']
  ScriptStripePricingTable: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptStripePricingTable.vue")['default']
  ScriptVimeoPlayer: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptVimeoPlayer.vue")['default']
  ScriptXEmbed: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptXEmbed.vue")['default']
  ScriptYouTubePlayer: typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptYouTubePlayer.vue")['default']
  NuxtWelcome: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtAnnouncer: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/nuxt-announcer")['default']
  NuxtImg: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  NuxtLinkLocale: typeof import("../../../../node_modules/.pnpm/@nuxtjs+i18n@10.4.1_778b2068c5c11ed90b1dfbc9eca5e0c3/node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']
  SwitchLocalePathLink: typeof import("../../../../node_modules/.pnpm/@nuxtjs+i18n@10.4.1_778b2068c5c11ed90b1dfbc9eca5e0c3/node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']
  NuxtPage: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/pages/runtime/page-placeholder")['default']
  NoScript: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyScriptGoogleMaps: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMaps.vue")['default']>
  LazyScriptGoogleMapsAdvancedMarkerElement: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsAdvancedMarkerElement.vue")['default']>
  LazyScriptGoogleMapsCircle: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsCircle.vue")['default']>
  LazyScriptGoogleMapsGeoJson: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsGeoJson.vue")['default']>
  LazyScriptGoogleMapsHeatmapLayer: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsHeatmapLayer.vue")['default']>
  LazyScriptGoogleMapsInfoWindow: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsInfoWindow.vue")['default']>
  LazyScriptGoogleMapsMarker: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsMarker.vue")['default']>
  LazyScriptGoogleMapsMarkerClusterer: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsMarkerClusterer.vue")['default']>
  LazyScriptGoogleMapsOverlayView: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsOverlayView.vue")['default']>
  LazyScriptGoogleMapsPinElement: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsPinElement.vue")['default']>
  LazyScriptGoogleMapsPolygon: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsPolygon.vue")['default']>
  LazyScriptGoogleMapsPolyline: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsPolyline.vue")['default']>
  LazyScriptGoogleMapsRectangle: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsRectangle.vue")['default']>
  LazyScriptGoogleMapsStaticMap: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsStaticMap.vue")['default']>
  LazyBindGoogleMapsEvents: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/bindGoogleMapsEvents")['default']>
  LazyInjectionKeys: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/injectionKeys")['default']>
  LazyTypes: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/types")['default']>
  LazyUseGoogleMapsResource: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/useGoogleMapsResource")['default']>
  LazyScriptAriaLoadingIndicator: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptAriaLoadingIndicator.vue")['default']>
  LazyScriptBlueskyEmbed: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptBlueskyEmbed.vue")['default']>
  LazyScriptCalendlyInlineWidget: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptCalendlyInlineWidget.vue")['default']>
  LazyScriptCarbonAds: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptCarbonAds.vue")['default']>
  LazyScriptCrisp: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptCrisp.vue")['default']>
  LazyScriptGoogleAdsense: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptGoogleAdsense.vue")['default']>
  LazyScriptGravatar: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptGravatar.vue")['default']>
  LazyScriptInstagramEmbed: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptInstagramEmbed.vue")['default']>
  LazyScriptIntercom: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptIntercom.vue")['default']>
  LazyScriptLemonSqueezy: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptLemonSqueezy.vue")['default']>
  LazyScriptLoadingIndicator: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptLoadingIndicator.vue")['default']>
  LazyScriptPayPalButtons: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptPayPalButtons.vue")['default']>
  LazyScriptPayPalMessages: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptPayPalMessages.vue")['default']>
  LazyScriptStripePricingTable: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptStripePricingTable.vue")['default']>
  LazyScriptVimeoPlayer: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptVimeoPlayer.vue")['default']>
  LazyScriptXEmbed: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptXEmbed.vue")['default']>
  LazyScriptYouTubePlayer: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxt+scripts@1.2.1_7bc0f91525b4f774c27e84103372222c/node_modules/@nuxt/scripts/dist/runtime/components/ScriptYouTubePlayer.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtAnnouncer: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/nuxt-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyNuxtLinkLocale: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxtjs+i18n@10.4.1_778b2068c5c11ed90b1dfbc9eca5e0c3/node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']>
  LazySwitchLocalePathLink: LazyComponent<typeof import("../../../../node_modules/.pnpm/@nuxtjs+i18n@10.4.1_778b2068c5c11ed90b1dfbc9eca5e0c3/node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']>
  LazyNuxtPage: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/pages/runtime/page-placeholder")['default']>
  LazyNoScript: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.5.1_8953eebd695925c861db6b0333d3dddf/node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
