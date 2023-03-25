import React, {useState} from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {Box, Button, Popover} from "@mui/material";
import {useForm} from "react-hook-form";
import Provider from "solive-provider";
import {ethers} from "ethers";

import {ModelInfoType} from '../../../types/monaco';
import {useEditor} from '../../editorContext';
import {FormProvider, RHFTextField} from "../hook-form";

interface Props {
  modelInfos: ModelInfoType[];
}


const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function PlayButton({modelInfos}: Props) {
  const {stateRef, actions} = useEditor();
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [contractDeployParams, setContractDeployParams] = useState<any[]>();

  const handleClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    setTimeout(async () => {
      const result: any = await stateRef.current.codeParser.compilerService.compile();
      const models = stateRef.current.models || [];
      const modelIndex = stateRef.current.modelIndex || 0;
      if (models[modelIndex]) {
        const filename = models[modelIndex]?.filename;
        const abi = result.output.contracts[filename];
        actions.createCurApi(abi);
        const params = result.output.contracts[filename].MyContract.abi.filter((item: any) => item.type === 'constructor')[0].inputs;
        setContractDeployParams(params);
      }
    })
  };

  console.log(contractDeployParams)

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const methods = useForm({mode: 'onBlur'});

  const handleDeploy = async (data) => {
    const provider = new Provider();
    // const accounts = await provider.getAccounts();
    // console.log(accounts);
    const signer = await provider.getSigner('0x5B38Da6a701c568545dCfcB03FcB875f56beddC4');
    console.log(
      stateRef.current.curAbi.MyContract.abi,
      stateRef.current.curAbi.MyContract.evm.bytecode.object
    );

    const contractFactory = new ethers.ContractFactory(
      stateRef.current.curAbi.MyContract.abi,
      stateRef.current.curAbi.MyContract.evm.bytecode.object,
      signer
    );
    const instance = await contractFactory.deploy(...Object.values(data));
    console.log(instance);
    // await instance.deployed();
    console.log(instance.address);

  }


  return (
    <>
      <div
        aria-describedby={id}
        onClick={handleClick}
        style={{display: 'flex', marginLeft: 'auto', marginRight: '3px'}}
      >
        <PlayArrowIcon sx={{color: "#09ad11", cursor: "pointer"}} />
      </div>
      {contractDeployParams && (
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          sx={{
            '& .MuiPopover-paper': {
              backgroundColor: 'white',
              border: '1px solid white',
              minWidth: '160px',
              zIndex: 1,
              margin: '3px',
            }
          }}
        >
          <Box px={2} py={2}>
            <FormProvider methods={methods}>
              {contractDeployParams.map((item: any) => <RHFTextField sx={{mt: 2}} label={item.name} name={item.name} />)}
            </FormProvider>
            <Button
              variant="contained"
              onClick={methods.handleSubmit(handleDeploy)}
            >
              部署
            </Button>
          </Box>
        </Popover>
      )}
    </>
  );
}
