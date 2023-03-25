import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
} from "@material-tailwind/react";
import {useState} from "react";

import {useEditor} from "../../editor/editorContext";

import CallBlock from "./CallBlock";
import ConsoleBlock from "./ConsoleBlock";

const animation = {
  initial: { y: 250 },
  mount: { y: 0 },
  unmount: { y: 250 },
};

const FooterConsole = () => {
  const {id} = useEditor();
  const data = [
    {
      label: "函数执行",
      value: "call",
      desc: `It really matters and then like it really doesn't matter.
      What matters is the people who are sparked by it. And the people
      who are like offended by it, it doesn't matter.`,
    },
    {
      label: "日志",
      value: "log",
      desc: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
    },
  ];

  const [selectedTab, setSelectedTab] = useState("call");

  return (
    <Tabs
      id={id + "_tabs"}
      value={selectedTab}
      onChange={(value: string) => console.log(value)}
      className={`bg-[#0f172a] rounded-b-lg`}
    >
      <TabsHeader>
        {data.map(({ label, value }) => (
          <Tab
            key={id + "_tab_" + value}
            className={value === selectedTab ? '' : 'text-white'}
            value={value}
            onClick={() => setSelectedTab(value)}
          >
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody animate={animation}>
        <CallBlock />
        <ConsoleBlock />
      </TabsBody>
    </Tabs>
  );
}

export default FooterConsole;
