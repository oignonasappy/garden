import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/oignonasappy/",
      "BlueSky": "https://bsky.app/profile/did:plc:fxfy76ybhl47pqyjvx2tgdfr",
      "Taproot": "https://oignonasappy.github.io/taproot",
      "Monologue": "https://monologue.asappy.xyz",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  afterBody: [
    Component.Graph(),
    Component.Backlinks(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        //{ Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({ filterFn: () => true }),
    Component.DesktopOnly(
      Component.RecentNotes({ showTags: true }),
    ),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.MobileOnly(
      Component.RecentNotes({ showTags: true }),
    ),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  afterBody: [
    Component.MobileOnly(
      Component.RecentNotes({ showTags: true }),
    ),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({ filterFn: () => true }),
    Component.DesktopOnly(
      Component.RecentNotes({ showTags: true }),
    ),
  ],
  right: [],
}
