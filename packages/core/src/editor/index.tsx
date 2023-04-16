import React, { useState } from 'react';

import { Allotment } from 'allotment';
import { CommandLineIcon } from '@heroicons/react/24/outline';
import merge from 'lodash/merge';

import { ModelInfoType } from '../types/monaco';
import FileNavBar from '../components/FileNavBar';
import Console from '../components/Console';
import DeployAndCall from '../components/DeployAndCall';
import CssWrapper from '../components/CssWrapper';

import { EditorProvider } from './contexts/editorContext';
import MonacoEditor from './monacoEditor';
import { ConsoleProvider } from './contexts/consoleContext';
import { DeployedProvider } from './contexts/deployedContext';
import { RelayNetworkProvider } from './contexts/relayNetworkContext';

export type TConsoleProps = {
  defaultVisible?: boolean;
  defaultHeight?: string;
  minHeight?: number;
  triggerControl?: boolean;
  open?: boolean;
}

export type TDeployProps = {
  defaultVisible?: boolean;
  defaultWidth?: string;
  minWidth?: number;
  maxWidth?: number;
  open?: boolean;
}

export type TFileNavProps = {
  open?: boolean;
}

export type TEditorProps = {
  id: string;
  modelInfos: ModelInfoType[];
  height: string;
  fileNav?: TFileNavProps;
  rounded?: string;
  console?: TConsoleProps;
  deploy?: TDeployProps;
  // onSuccess?: Dispatch<SetStateAction<number>>;
  // onFailure?: () => void;
  // onCompile?: () => void;
  // submissionCount?: number;
  children?: any;
};

const DefaultConsoleProps = {
  open: true,
  triggerControl: true,
  defaultVisible: true,
  minHeight: 78,
  defaultHeight: '30%',
};

const DefaultDeployProps = {
  open: true,
  defaultVisible: true,
  maxWidth: 240,
  minWidth: 140,
  defaultWidth: '200px',
};

const DefaultFileNavProps = {
  open: true,
};

function Main(props: TEditorProps) {
  const {
    height,
    console = {},
    deploy = {},
    fileNav = {},
    rounded = '12px',
    modelInfos,
  } = props;
  const consoleProps = merge(DefaultConsoleProps, console);
  const deployProps = merge(DefaultDeployProps, deploy);
  const fileNavProps = merge(DefaultFileNavProps, fileNav);

  const [consoleVisible, setConsoleVisible] = useState<boolean>(consoleProps.defaultVisible);
  const [deployVisible, setDeployVisible] = useState<boolean>(deployProps.defaultVisible);

  const handleDeployContainerVisible = (index: number, value: boolean) => {
    if (index === 1) {
      setDeployVisible(value);
    }
  };

  const handleConsoleVisible = (index: number, value: boolean) => {
    if (index === 1) {
      setConsoleVisible(value);
    }
  };

  return (
    <div className="bg-primary-700 overflow-auto" style={{ height, borderRadius: rounded }}>
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
                {fileNavProps.open && (
                  <FileNavBar onClickRun={() => {
                    setDeployVisible((old) => !old);
                    setConsoleVisible((old) => !old);
                  }}
                  />
                )}
                <MonacoEditor modelInfos={modelInfos} />
              </Allotment.Pane>
              {consoleProps.open && (
                <Allotment.Pane
                  minSize={consoleProps.minHeight}
                  preferredSize={consoleProps.defaultHeight}
                  visible={consoleVisible}
                >
                  <Console onDeleteClick={() => setConsoleVisible(false)} />
                </Allotment.Pane>
              )}
              {!consoleVisible && consoleProps.open && consoleProps.triggerControl && (
                <Allotment.Pane snap={false} maxSize={24} minSize={24}>
                  <div
                    tabIndex={0}
                    role="button"
                    className="ml-4 h-full flex items-center gap-1 text-[12px] text-primary-100 cursor-pointer"
                    onClick={() => setConsoleVisible(true)}
                  >
                    <CommandLineIcon className="w-4 h-4" />
                    <span>Console</span>
                  </div>
                </Allotment.Pane>
              )}
            </Allotment>
          </div>
        </Allotment.Pane>
        {deployProps.open && (
          <Allotment.Pane
            maxSize={deployProps.maxWidth}
            minSize={deployProps.minWidth}
            preferredSize={deployProps.defaultWidth}
            visible={deployVisible}
          >
            <DeployAndCall />
          </Allotment.Pane>
        )}
      </Allotment>
    </div>
  );
}

export default function Editor(props: TEditorProps) {
  const { id } = props;
  return (
    <EditorProvider id={id}>
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
