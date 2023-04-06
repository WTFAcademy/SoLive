import NavBar from "../NavBar";

const Test = [
  {
    label: "Storage.sol",
    id: "storage",
  },
  {
    label: "SimpleStorage.sol",
    id: "simple-storage",
  },
  {
    label: "SimpleStorage.sol",
    id: "simple-storage2",
  }
]

const FileNavBar = () => {

  return (
    <div className="w-full pt-2">
      <NavBar navs={Test} />
    </div>
  )
}

export default FileNavBar;
