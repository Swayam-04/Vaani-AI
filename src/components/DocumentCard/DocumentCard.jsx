import React from 'react';
import { Card, Button, Tag, Tooltip } from 'antd';
import { FiFileText, FiTrash2, FiActivity, FiVolume2, FiHelpCircle } from 'react-icons/fi';
import styles from './DocumentCard.module.css';

export default function DocumentCard({ doc, onSummarize, onAsk, onRead, onDelete, isActive }) {
  const getFileIcon = (type) => {
    return <FiFileText className={styles.docIcon} />;
  };

  const getFormatTagColor = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return '#f5222d';
      case 'docx':
        return '#1890ff';
      default:
        return '#722ed1';
    }
  };

  return (
    <Card
      className={`${styles.card} ${isActive ? styles.activeCard : ''}`}
      hoverable
    >
      <div className={styles.content}>
        <div className={styles.header}>
          {getFileIcon(doc.type)}
          <div className={styles.titleContainer}>
            <span className={styles.filename} title={doc.filename}>{doc.filename}</span>
            <span className={styles.timestamp}>
              Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className={styles.metaRow}>
          <Tag color={getFormatTagColor(doc.type)} className={styles.badge}>
            {doc.type}
          </Tag>
          {doc.size && <span className={styles.fileSize}>{doc.size}</span>}
        </div>

        <div className={styles.actionsRow}>
          <Tooltip title="Extract key insights and summaries" placement="top">
            <Button 
              type="default" 
              icon={<FiActivity />} 
              onClick={(e) => { e.stopPropagation(); onSummarize(doc); }}
              className={styles.actionBtn}
            >
              Summarize
            </Button>
          </Tooltip>
          <Tooltip title="Ask questions about this document" placement="top">
            <Button 
              type="default" 
              icon={<FiHelpCircle />} 
              onClick={(e) => { e.stopPropagation(); onAsk(doc); }}
              className={styles.actionBtn}
            >
              Ask Qs
            </Button>
          </Tooltip>
          <Tooltip title="Read the document text aloud" placement="top">
            <Button 
              type="default" 
              icon={<FiVolume2 />} 
              onClick={(e) => { e.stopPropagation(); onRead(doc); }}
              className={styles.actionBtn}
            >
              Read Aloud
            </Button>
          </Tooltip>
          <Tooltip title="Permanently delete from index" placement="top">
            <Button 
              type="primary"
              danger 
              icon={<FiTrash2 />} 
              onClick={(e) => { e.stopPropagation(); onDelete(doc); }}
              className={`${styles.actionBtn} ${styles.deleteBtn}`}
            >
              Delete
            </Button>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
}
