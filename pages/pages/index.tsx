import React, { useEffect, useState } from 'react'

import PageTitle from 'components/Typography/PageTitle'
import Layout from 'containers/Layout'

function Dashboard() {

  return (
      <Layout>
        <PageTitle>主页</PageTitle>
        <p>欢迎来到供应链溯源管理系统主页</p>
      </Layout>
  );

}

export default Dashboard

