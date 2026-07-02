'use client';

import React, { useEffect } from 'react';

const AdminModerationPage: React.FC = () => {
  useEffect(() => {
    window.location.href = '/moderation-center/review';
  }, []);

  const content = null;

  return content;
};

export default AdminModerationPage;
