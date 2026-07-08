import React, { useState } from 'react';
import { Card, Form, Input, Button, Alert, message } from 'antd';
import { FiLock, FiUser, FiShield } from 'react-icons/fi';
import styles from './Login.module.css';

export default function Login({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          password: values.password
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        message.success("Authentication successful!");
        onLoginSuccess(data.access_token);
      } else {
        setErrorMsg(data.error || "Invalid username or password.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Cannot connect to secure auth server. Verify Flask backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.backgroundGlow} />
      
      <Card className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <FiShield className={styles.logoIcon} />
          </div>
          <h2 className={styles.title}>VAANI AI</h2>
          <p className={styles.subtitle}>Secure Speech Intelligence Platform</p>
        </div>

        {errorMsg && (
          <Alert
            message={errorMsg}
            type="error"
            showIcon
            className={styles.alert}
          />
        )}

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input 
              prefix={<FiUser className={styles.inputIcon} />} 
              placeholder="Username (admin)" 
              className={styles.input}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your security key' }]}
          >
            <Input.Password
              prefix={<FiLock className={styles.inputIcon} />}
              placeholder="Security Key (admin)"
              className={styles.input}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: '24px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              className={styles.submitBtn}
            >
              Unlock Terminal
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.footer}>
          <span>Restricted Access System</span>
          <span className={styles.dot}>•</span>
          <span>Fully Offline Encryption</span>
        </div>
      </Card>
    </div>
  );
}
