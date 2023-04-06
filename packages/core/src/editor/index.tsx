import React, {Dispatch, SetStateAction} from 'react';

import {ModelInfoType} from '../types/monaco';

import {EditorProvider} from './contexts/editorContext';
import MonacoEditor from './monacoEditor';
import {ConsoleProvider} from "./contexts/consoleContext";
import {DeployProvider} from "./contexts/deployContext";
import Button from "../components-refactor/Button";
import Input from "../components-refactor/Input";
import Select from "../components-refactor/Select";
import {XMarkIcon} from "@heroicons/react/24/solid";
import NavBar from "../components-refactor/NavBar";

export type EditorProps = {
  id: string;
  modelInfos: ModelInfoType[];
  height: string;
  onSuccess?: Dispatch<SetStateAction<number>>;
  onFailure?: () => void;
  onCompile?: () => void;
  submissionCount?: number;
  children?: any;
};

export default function Editor(
  {
    modelInfos,
    id,
    height
  }: EditorProps
) {
  return (
    <EditorProvider id={id}>
      <ConsoleProvider>
        <DeployProvider>
          <div id="solive-tailwind">
            <div className="w-[1000px] h-[600px] bg-[#20293B] rounded-[4px] pt-2">
              <NavBar navs={[{id: '1', label: 'a.sol'}, {id: '2', label: 'c.sol'}]} />
            </div>
            <Button type="primary">测试1</Button>
            <Button type="default">测试2</Button>
            <Input placeholder="请输入"/>
            <Select value={2} options={[{label: 'tets1', value: 1}, {label: "test2", value: 2}]}/>
            <MonacoEditor height={height} modelInfos={modelInfos}/>
          </div>
        </DeployProvider>
      </ConsoleProvider>
    </EditorProvider>
  );
}
