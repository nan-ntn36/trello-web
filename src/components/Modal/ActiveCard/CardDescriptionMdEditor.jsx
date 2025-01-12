import { useState } from 'react';
// import { useColorScheme } from '@mui/system';
import { useColorScheme } from '@mui/material';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import EditNoteIcon from '@mui/icons-material/EditNote';

// eslint-disable-next-line no-unused-vars
const markdownValueExample = `
  *\`Markdown Content Example:\`*

  **Hello world | Trello MERN Stack Advanced**
  ![](data:image/jpeg;base64,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)
  \`\`\`javascript
  import React from "react"
  import ReactDOM from "react-dom"
  import MDEditor from '@uiw/react-md-editor'
  \`\`\`
`;
/**
 * Vài ví dụ Markdown từ lib
 * https://codesandbox.io/embed/markdown-editor-for-react-izdd6?fontsize=14&hidenavigation=1&theme=dark
 */
function CardDescriptionMdEditor({
  cardDescriptionProps,
  handleUpdateCardDesc,
}) {
  // Lấy giá trị 'dark', 'light' hoặc 'system' mode từ MUI để support phần Markdown bên dưới: data-color-mode={mode}
  // https://www.npmjs.com/package/@uiw/react-md-editor#support-dark-modenight-mode
  const { mode } = useColorScheme();

  // State xử lý chế độ Edit và chế độ View
  const [markdownEditMode, setMarkdownEditMode] = useState(false);
  // State xử lý giá trị markdown khi chỉnh sửa
  const [cardDescription, setCardDescription] = useState(cardDescriptionProps);

  const updateCardDescription = () => {
    setMarkdownEditMode(false);
    handleUpdateCardDesc(cardDescription);
  };

  return (
    <Box sx={{ mt: -4 }}>
      {markdownEditMode ? (
        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box data-color-mode={mode}>
            <MDEditor
              value={cardDescription}
              onChange={setCardDescription}
              previewOptions={{ rehypePlugins: [[rehypeSanitize]] }} // https://www.npmjs.com/package/@uiw/react-md-editor#security
              height={400}
              preview="edit" // Có 3 giá trị để set tùy nhu cầu ['edit', 'live', 'preview']
              // hideToolbar={true}
            />
          </Box>
          <Button
            sx={{ alignSelf: 'flex-end' }}
            onClick={updateCardDescription}
            className="interceptor-loading"
            type="button"
            variant="contained"
            size="small"
            color="info"
          >
            Save
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            sx={{ alignSelf: 'flex-end' }}
            onClick={() => setMarkdownEditMode(true)}
            type="button"
            variant="contained"
            color="info"
            size="small"
            startIcon={<EditNoteIcon />}
          >
            Edit
          </Button>
          <Box data-color-mode={mode}>
            <MDEditor.Markdown
              source={cardDescription}
              style={{
                whiteSpace: 'pre-wrap',
                padding: cardDescription ? '10px' : '0px',
                border: cardDescription
                  ? '0.5px solid rgba(0, 0, 0, 0.2)'
                  : 'none',
                borderRadius: '8px',
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default CardDescriptionMdEditor;
