import { test, expect, vi } from "vitest";
import { createTray } from "./tray.js";
import { BrowserWindow, Menu } from "electron";

const setContextMenu = vi.fn();

vi.mock("electron", () => {
  return {
    Tray: vi.fn().mockImplementation(function () {
      return {
        setContextMenu,
      };
    }),
    app: {
      getAppPath: vi.fn().mockReturnValue("/"),
      dock: {
        show: vi.fn(),
      },
      quit: vi.fn(),
    },
    Menu: {
      buildFromTemplate: vi.fn(),
    },
  };
});

vi.mock("./pathResolver.js", () => {
  return {
    getAssetsPath: vi.fn().mockReturnValue("/"),
  };
});

const mainWindow = {
  show: vi.fn(),
} satisfies Partial<BrowserWindow> as any as BrowserWindow;

test("creates a tray with a context menu", () => {
  createTray(mainWindow);

  expect(Menu.buildFromTemplate).toHaveBeenCalledWith(
    expect.arrayContaining([
      expect.objectContaining({ label: "Show" }),
      expect.objectContaining({ label: "Quit" }),
    ]),
  );
  expect(setContextMenu).toHaveBeenCalledTimes(1);
});
