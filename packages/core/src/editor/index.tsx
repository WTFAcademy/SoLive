import React, {Dispatch, SetStateAction, useState} from 'react';
import {Allotment} from "allotment";
import {CommandLineIcon} from "@heroicons/react/24/outline";

import {ModelInfoType} from '../types/monaco';
import FileNavBar from "../components/FileNavBar";
import Console from "../components/Console";
import DeployAndCall from "../components/DeployAndCall";
import CssWrapper from "../components/CssWrapper";

import {EditorProvider} from './contexts/editorContext';
import MonacoEditor from './monacoEditor';
import {ConsoleProvider} from "./contexts/consoleContext";
import {DeployedProvider} from "./contexts/deployedContext";
import {RelayNetworkProvider} from "./contexts/relayNetworkContext";

export type TConsoleProps = {
  defaultVisible?: boolean;
  defaultHeight?: string;
  minHeight?: number;
}

export type TDeployProps = {
  defaultVisible?: boolean;
  defaultWidth?: string;
  minWidth?: number;
  maxWidth?: number;
}

export type TEditorProps = {
  id: string;
  modelInfos: ModelInfoType[];
  height: string;
  rounded?: string;
  console?: TConsoleProps;
  deploy?: TDeployProps;
  onSuccess?: Dispatch<SetStateAction<number>>;
  onFailure?: () => void;
  onCompile?: () => void;
  submissionCount?: number;
  children?: any;
};

const Main = (props: TEditorProps) => {
  const {height, console = {}, deploy = {}, rounded = '12px', modelInfos} = props;
  const [consoleVisible, setConsoleVisible] = useState<boolean>(console.defaultVisible === undefined ? true : console.defaultVisible);
  const [deployVisible, setDeployVisible] = useState<boolean>(deploy.defaultVisible === undefined ? true : deploy.defaultVisible);

  const handleDeployContainerVisible = (index: number, value: boolean) => {
    if (index === 1) {
      setDeployVisible(value);
    }
  }

  const handleConsoleVisible = (index: number, value: boolean) => {
    if (index === 1) {
      setConsoleVisible(value);
    }
  }

  return (
    <div className="bg-primary-700 overflow-auto" style={{height, borderRadius: rounded}}>
      <Allotment
        snap
        onVisibleChange={handleDeployContainerVisible}
      >
        <Allotment.Pane
          minSize={200}
          snap={false}
        >
          <div className="w-full h-full border-none border-l border-solid border-primary-500">
            <Allotment
              snap
              vertical
              onVisibleChange={handleConsoleVisible}
            >
              <Allotment.Pane minSize={100}>
                <FileNavBar onClickRun={() => setDeployVisible(old => !old)}/>
                <MonacoEditor modelInfos={modelInfos}/>
              </Allotment.Pane>
              <Allotment.Pane
                minSize={console.minHeight || 78}
                preferredSize={console.defaultHeight || "30%"}
                visible={consoleVisible}
              >
                <Console/>
              </Allotment.Pane>
              {!consoleVisible &&
              <Allotment.Pane snap={false} maxSize={24} minSize={24}>
                <div
                  className="ml-4 h-full flex items-center gap-1 text-[12px] text-primary-100 cursor-pointer"
                  onClick={() => setConsoleVisible(true)}
                >
                  <CommandLineIcon className="w-4 h-4"/>
                  <span>Console</span>
                </div>
              </Allotment.Pane>
              }
            </Allotment>
          </div>
        </Allotment.Pane>
        <Allotment.Pane
          maxSize={deploy.maxWidth || 240}
          minSize={deploy.minWidth || 140}
          preferredSize={deploy.defaultWidth || "200px"}
          visible={deployVisible}
        >
          <DeployAndCall/>
        </Allotment.Pane>
      </Allotment>
    </div>
  )
}

export default function Editor(props: TEditorProps) {
  return (
    <EditorProvider id={props.id}>
      <RelayNetworkProvider>
        <ConsoleProvider>
          <DeployedProvider>
            <CssWrapper>
              <Main {...props} />
            </CssWrapper>
          </DeployedProvider>
        </ConsoleProvider>
      </RelayNetworkProvider>
    </EditorProvider>
  );
}
