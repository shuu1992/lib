// CopyToClipboardTooltip.js
import { useState, ReactElement } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

export interface CopyToClipboardTooltipProps {
  children: ReactElement;
  text: string;
}
export default function CopyToClipboardTooltip({ children, text }: CopyToClipboardTooltipProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(t('sys.clickToCopy'));

  const handleCopy = () => {
    setTitle(t('sys.copyToClipboard'));
    setOpen(true);

    setTimeout(() => {
      setTitle(t('sys.clickToCopy'));
      setOpen(false);
    }, 2000);
  };

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <CopyToClipboard text={text} onCopy={handleCopy}>
      <Tooltip
        title={title}
        open={open}
        onClose={handleTooltipClose}
        onOpen={handleTooltipOpen}
        arrow
        followCursor
        placement="top"
      >
        {children}
      </Tooltip>
    </CopyToClipboard>
  );
}
