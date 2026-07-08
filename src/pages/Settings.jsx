import React from 'react';
import { Card, Select, Slider, Switch, Row, Col, InputNumber } from 'antd';
import { FiVolume2, FiGlobe, FiUser, FiActivity, FiShield, FiCpu, FiHardDrive } from 'react-icons/fi';
import styles from './Settings.module.css';

export default function Settings({ settings, onUpdateSetting }) {
  const voiceOptions = [
    { value: 'default', label: 'Default System Voice' },
    { value: 'male', label: 'Male (Chatterbox)' },
    { value: 'female', label: 'Female (Chatterbox)' },
    { value: 'neural', label: 'Neural Voice (DRDO Spec)' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English (General)' },
    { value: 'hi', label: 'Hindi (हिंदी)' },
    { value: 'or', label: 'Odia (ଓଡ଼ିଆ)' }
  ];

  const modelOptions = [
    { value: 'gemma4', label: 'Gemma 4 (Default)' },
    { value: 'llama3.2:3b', label: 'Llama 3.2 (3B)' },
    { value: 'qwen3:4b', label: 'Qwen3 (4B)' },
    { value: 'qwen3:8b', label: 'Qwen3 (8B)' }
  ];

  const speedMarks = {
    0.5: '0.5x',
    1.0: '1.0x',
    1.5: '1.5x',
    2.0: '2.0x'
  };

  const handleSelectChange = (key) => (value) => {
    onUpdateSetting(key, value);
  };

  const handleSliderChange = (key) => (value) => {
    onUpdateSetting(key, value);
  };

  const handleToggleChange = (key) => (checked) => {
    onUpdateSetting(key, checked);
  };

  const handleNumberChange = (key) => (value) => {
    onUpdateSetting(key, value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>System Settings</h1>
        <p className={styles.subtitle}>Configure offline speech synthesis parameters, AI memory models, and secure vault policies.</p>
      </div>

      <Row gutter={[20, 20]}>
        {/* Card 1: Voice & Language Engine */}
        <Col xs={24} lg={12}>
          <Card 
            className={styles.card}
            title={
              <div className={styles.cardTitleRow}>
                <FiActivity className={styles.sectionIcon} />
                <span>Voice & Language Engine</span>
              </div>
            }
          >
            <div className={styles.settingItem}>
              <label className={styles.label}>
                <FiUser className={styles.itemIcon} /> Voice Synthesizer Model
              </label>
              <Select
                value={settings.voice}
                onChange={handleSelectChange('voice')}
                options={voiceOptions}
                className={styles.select}
              />
            </div>

            <div className={styles.settingItem}>
              <label className={styles.label}>
                <FiGlobe className={styles.itemIcon} /> Output Language
              </label>
              <Select
                value={settings.language}
                onChange={handleSelectChange('language')}
                options={languageOptions}
                className={styles.select}
              />
            </div>
          </Card>
        </Col>

        {/* Card 2: Speech Characteristics */}
        <Col xs={24} lg={12}>
          <Card 
            className={styles.card}
            title={
              <div className={styles.cardTitleRow}>
                <FiVolume2 className={styles.sectionIcon} />
                <span>Speech Characteristics</span>
              </div>
            }
          >
            <div className={styles.settingItem}>
              <label className={styles.label}>Speech Speed</label>
              <div className={styles.sliderWrapper}>
                <Slider
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={settings.speed}
                  onChange={handleSliderChange('speed')}
                  marks={speedMarks}
                  className={styles.slider}
                  tooltip={{ formatter: (val) => `${val}x` }}
                />
              </div>
            </div>

            <div className={styles.settingItem} style={{ marginTop: '32px' }}>
              <label className={styles.label}>Output Volume</label>
              <div className={styles.sliderWrapper}>
                <Slider
                  min={0}
                  max={100}
                  value={settings.volume}
                  onChange={handleSliderChange('volume')}
                  className={styles.slider}
                  tooltip={{ formatter: (val) => `${val}%` }}
                />
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 3: AI Model & Memory */}
        <Col xs={24} lg={12}>
          <Card 
            className={styles.card}
            title={
              <div className={styles.cardTitleRow}>
                <FiCpu className={styles.sectionIcon} />
                <span>AI Model & Conversation Memory</span>
              </div>
            }
          >
            <div className={styles.settingItem}>
              <label className={styles.label}>Preferred LLM Model</label>
              <Select
                value={settings.preferredModel || 'gemma4'}
                onChange={handleSelectChange('preferredModel')}
                options={modelOptions}
                className={styles.select}
              />
            </div>

            <div className={styles.toggleRow} style={{ marginTop: '24px' }}>
              <div>
                <span className={styles.toggleLabel}>Enable AI Memory</span>
                <div className={styles.toggleDesc}>Retain conversation context across user prompts.</div>
              </div>
              <Switch
                checked={settings.memoryEnabled}
                onChange={handleToggleChange('memoryEnabled')}
              />
            </div>

            {settings.memoryEnabled && (
              <div className={styles.settingItem} style={{ marginTop: '24px' }}>
                <label className={styles.label}>Context Window Size (Messages)</label>
                <InputNumber
                  min={2}
                  max={50}
                  value={settings.contextWindow || 10}
                  onChange={handleNumberChange('contextWindow')}
                  className={styles.numberInput}
                />
              </div>
            )}
          </Card>
        </Col>

        {/* Card 4: RAG Document Extraction */}
        <Col xs={24} lg={12}>
          <Card 
            className={styles.card}
            title={
              <div className={styles.cardTitleRow}>
                <FiHardDrive className={styles.sectionIcon} />
                <span>RAG Document Extraction Settings</span>
              </div>
            }
          >
            <div className={styles.settingItem}>
              <label className={styles.label}>Text Chunk Size (Characters)</label>
              <InputNumber
                min={100}
                max={2000}
                step={50}
                value={settings.chunkSize || 500}
                onChange={handleNumberChange('chunkSize')}
                className={styles.numberInput}
              />
            </div>

            <div className={styles.settingItem} style={{ marginTop: '24px' }}>
              <label className={styles.label}>Chunk Overlap (Characters)</label>
              <InputNumber
                min={10}
                max={500}
                step={10}
                value={settings.chunkOverlap || 100}
                onChange={handleNumberChange('chunkOverlap')}
                className={styles.numberInput}
              />
            </div>
          </Card>
        </Col>

        {/* Card 5: System & Security Policies */}
        <Col xs={24}>
          <Card 
            className={styles.card}
            title={
              <div className={styles.cardTitleRow}>
                <FiShield className={styles.sectionIcon} />
                <span>System & Security Policies</span>
              </div>
            }
          >
            <Row gutter={[24, 20]}>
              <Col xs={24} md={12}>
                <div className={styles.toggleRow}>
                  <div>
                    <span className={styles.toggleLabel}>Auto Play Synthesized Audio</span>
                    <div className={styles.toggleDesc}>Play generated MP3 immediately after synthesis finishes.</div>
                  </div>
                  <Switch
                    checked={settings.autoPlay}
                    onChange={handleToggleChange('autoPlay')}
                  />
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div className={styles.toggleRow}>
                  <div>
                    <span className={styles.toggleLabel}>Force Platform Dark Theme</span>
                    <div className={styles.toggleDesc}>Restricted to dark mode for eye strain reduction in secure vaults.</div>
                  </div>
                  <Switch
                    checked={settings.darkTheme}
                    disabled={true}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
