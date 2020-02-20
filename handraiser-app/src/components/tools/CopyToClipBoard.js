import React, {useState} from 'react'
import copy from "clipboard-copy";

// MATERIAL-UI
import {
    Tooltip,
    ClickAwayListener,
  } from "@material-ui/core/";

// ICONS
import FileCopyIcon from '@material-ui/icons/FileCopy';

export default function CopyToClipboard({ data }) {
    const [open, setOpen] = useState(false);
  
    return (
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <div>
          <Tooltip
            PopperProps={{
              disablePortal: true,
            }}
            onClose={() => setOpen(false)}
            open={open}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title="Copied to Clipboard"
          >
            <FileCopyIcon
              style={{ cursor: `pointer`, width:`20px` }}
              onClick={() => {
                copy(data)
                setOpen(true);
              }}
            />
          </Tooltip>
        </div>
      </ClickAwayListener>
    )
  }