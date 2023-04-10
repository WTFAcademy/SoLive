import React, {Dispatch, SetStateAction, useState} from 'react';
import {Allotment} from "allotment";

import {ModelInfoType} from '../types/monaco';
import FileNavBar from "../components-refactor/FileNavBar";
import Console from "../components-refactor/Console";
import DeployAndCall from "../components-refactor/DeployAndCall";
import CssWrapper from "../components-refactor/CssWrapper";

import {EditorProvider} from './contexts/editorContext';
import MonacoEditor from './monacoEditor';
import {ConsoleProvider} from "./contexts/consoleContext";
import {DeployedProvider} from "./contexts/deployedContext";
import {RelayNetworkProvider} from "./contexts/relayNetworkContext";

export type TEditorProps = {
  id: string;
  modelInfos: ModelInfoType[];
  height: string;
  onSuccess?: Dispatch<SetStateAction<number>>;
  onFailure?: () => void;
  onCompile?: () => void;
  submissionCount?: number;
  children?: any;
};

const Main = (props: TEditorProps) => {
  const {height, modelInfos} = props;
  const [consoleVisible, setConsoleVisible] = useState(true);
  const [deployVisible, setDeployVisible] = useState(true);

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
    <div className="rounded-[12px] bg-primary-700 overflow-auto h-[500px]">
      <Allotment
        snap
        onVisibleChange={handleDeployContainerVisible}
      >
        <Allotment.Pane
          minSize={200}
        >
          <div className="w-full h-full border-none border-l border-solid border-primary-500">
            <Allotment
              snap
              vertical
              onVisibleChange={handleConsoleVisible}
            >
              <Allotment.Pane minSize={100}>
                <FileNavBar/>
                <MonacoEditor height={height} modelInfos={modelInfos}/>
              </Allotment.Pane>
              <Allotment.Pane minSize={78} preferredSize="40%" visible={consoleVisible}>
                <Console/>
              </Allotment.Pane>
            </Allotment>
          </div>
        </Allotment.Pane>
        <Allotment.Pane
          maxSize={240}
          minSize={140}
          preferredSize="200px"
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
