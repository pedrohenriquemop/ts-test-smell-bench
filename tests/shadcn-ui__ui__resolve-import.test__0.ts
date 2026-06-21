test("resolve import", async () => {
  expect(
    await resolveImport("@/foo/bar", {
      absoluteBaseUrl: "/Users/shadcn/Projects/foobar",
      paths: {
        "@/*": ["./src/*"],
        "~/components/*": ["./src/components/*"],
        "~/lib": ["./src/lib"],
      },
    })
  ).toEqual("/Users/shadcn/Projects/foobar/src/foo/bar")

  expect(
    await resolveImport("~/components/foo/bar/baz", {
      absoluteBaseUrl: "/Users/shadcn/Projects/foobar",
      paths: {
        "@/*": ["./src/*"],
        "~/components/*": ["./src/components/*"],
        "~/lib": ["./src/lib"],
      },
    })
  ).toEqual("/Users/shadcn/Projects/foobar/src/components/foo/bar/baz")

  expect(
    await resolveImport("components/foo/bar", {
      absoluteBaseUrl: "/Users/shadcn/Projects/foobar",
      paths: {
        "components/*": ["./src/app/components/*"],
        "ui/*": ["./src/ui/primities/*"],
        lib: ["./lib"],
      },
    })
  ).toEqual("/Users/shadcn/Projects/foobar/src/app/components/foo/bar")

  expect(
    await resolveImport("lib/utils", {
      absoluteBaseUrl: "/Users/shadcn/Projects/foobar",
      paths: {
        "components/*": ["./src/app/components/*"],
        "ui/*": ["./src/ui/primities/*"],
        lib: ["./lib"],
      },
    })
  ).toEqual("/Users/shadcn/Projects/foobar/lib/utils")
})