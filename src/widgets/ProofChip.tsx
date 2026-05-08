import { useState } from 'react';
import { Box, Chip, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

export interface ProofChipProps {
  value: string;
  label?: string;
  size?: 'small' | 'medium';
}

/**
 * Truncated, copyable cryptographic-hash chip. The full hash lives
 * in the tooltip; click copies to clipboard. Renders bytes that are
 * usually a sha256 / blake3 / merkle root.
 */
export function ProofChip({ value, label, size = 'small' }: ProofChipProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const display = label ?? truncate(value);

  return (
    <Tooltip title={value} placement="top" arrow>
      <Chip
        size={size}
        variant="outlined"
        label={
          <Box component="span" sx={{ fontFamily: 'monospace' }}>
            {display}
          </Box>
        }
        deleteIcon={copied ? <CheckIcon /> : <ContentCopyIcon fontSize="small" />}
        onDelete={handleCopy}
        onClick={handleCopy}
        sx={{ '& .MuiChip-deleteIcon': { fontSize: 14 } }}
      />
    </Tooltip>
  );
}

function truncate(s: string, head = 12, tail = 6): string {
  if (s.length <= head + tail + 1) return s;
  return `${s.slice(0, head)}…${s.slice(-tail)}`;
}
