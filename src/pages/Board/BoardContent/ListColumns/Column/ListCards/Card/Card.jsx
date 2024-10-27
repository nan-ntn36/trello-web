import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import GroupsIcon from '@mui/icons-material/Groups';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function TrelloCard({ card }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card._id, data: { ...card } });

  const dndKitCardStyle = {
    // touchAction: "none", // dành cho sensor default Pointersensor
    // dùng Translate không bị bug
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined,
  };

  function shouldShowCardAction() {
    return (
      !!card?.memberIds?.length ||
      !!card?.comments?.length ||
      !!card?.attachments?.length
    );
  }

  return (
    <Card
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
        overflow: 'unset',
        display: card?.FE_PlaceholderCard ? 'none' : 'block',
      }}
      ref={setNodeRef}
      style={dndKitCardStyle}
      {...attributes}
      {...listeners}
    >
      {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} />}
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>{card?.title}</Typography>
      </CardContent>
      {shouldShowCardAction() && (
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {!!card?.memberIds?.length && (
            <Button size="small" startIcon={<GroupsIcon fontSize="small" />}>
              {card?.memberIds?.length}
            </Button>
          )}
          {!!card?.comments?.length && (
            <Button
              size="small"
              startIcon={<ModeCommentIcon fontSize="small" />}
            >
              {card?.comments?.length}
            </Button>
          )}
          {!!card?.attachments?.length && (
            <Button
              size="small"
              startIcon={<AttachFileIcon fontSize="small" />}
            >
              {card?.attachments?.length}
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
}

export default TrelloCard;
