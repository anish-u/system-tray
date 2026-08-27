type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storageUsage: number;
};

type StaticData = {
  totalStorage: number;
  cpuModel: string;
  totalMemory: number;
};

type UnSubscribeFunction = () => void;

type View = "CPU" | "RAM" | "STORAGE";

type FrameWindowAction = "MINIMIZE" | "MAXIMIZE" | "CLOSE";

type EventPayloadMapping = {
  statistics: Statistics;
  getStaticData: StaticData;
  changeView: View;
  sendFrameWindowAction: FrameWindowAction;
};

interface Window {
  electron: {
    subscribeStatistics: (
      callback: (statistics: Statistics) => void,
    ) => UnSubscribeFunction;
    getStaticData: () => Promise<StaticData>;
    subscribeChangeView: (
      callback: (view: View) => void,
    ) => UnSubscribeFunction;
    sendFrameWindowAction: (action: FrameWindowAction) => void;
  };
}
