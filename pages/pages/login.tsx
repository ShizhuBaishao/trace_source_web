import React, {
  useContext,
  useEffect,
  useState,
} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import {
  fetchUserInfo,
  IMyResponse,
  isRegistered, nodes,
  sign,
} from 'api/user'
import { saveUserInfo } from 'utils/data'

import { Label, Input, Button, WindmillContext, Modal, ModalBody, ModalFooter } from '@roketid/windmill-react-ui'

function LoginPage() {
  const { mode } = useContext(WindmillContext)
  const [isUserExists, setIsUserExists] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const router = useRouter()
  const [userName, setUserName] = useState<string>('')
  const [userInfo, setUserInfo] = useState<any>({})

  useEffect(() => {
    if (isUserExists) {
      openModal()
    }
  }, [isUserExists])

  const imgSource = mode === 'dark' ? '/assets/img/login-office-dark.jpeg' : '/assets/img/login-office.jpg'

  function openModal() {
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsUserExists(false)
    setIsModalOpen(false)
  }

  async function getUserInfo(userName: string) {
    const result = await fetchUserInfo(userName) as IMyResponse
    if (result.message !== 'success') {
      alert('用户名不存在！')
      return
    }

    setUserInfo({
      signUserId: result.data.signUserId,
      address: result.data.address,
    })
    await checkIfRegistered(result.data.signUserId, result.data.address)
    //获取用户权限
    let nodeResult = await getUserPermission(result.data.signUserId, result.data.address)
    console.log(nodeResult[1].toString())
    let isRegister = 0
    if (nodeResult[2] == "true") {
      isRegister = 1
    }
    saveUserInfo({
      signUserId: result.data.signUserId,
      address: result.data.address,
      nodeType: nodeResult[1],
      isRegister: isRegister.toString()
    })

  }

  async function checkIfRegistered(signUserId: string, address: string) {
    const result: any = await isRegistered(signUserId, address)
    setIsUserExists(result[0])
  }

  //获取用户权限
  async function getUserPermission(signUserId: string,address: string) {
    const result: any = await nodes(signUserId, address)
    return result
  }
  async function doLogin() {
    const result = await sign(userInfo.signUserId, 'test') as IMyResponse

    if (result.message !== 'success') {
      alert('登录验证失败！')
      return
    }

    onSignedOk()
  }

  function onSignedOk() {
    router.push('/pages/')
  }

  return (
    <div className='flex flex-col justify-center items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900'>
      <div className='mb-16 text-center text-4xl font-bold'>供应链溯源管理系统</div>
      <div className='h-full w-1/2 mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800'>
        <div className='flex flex-col overflow-y-auto md:flex-row'>
          <div className='relative h-32 md:h-auto md:w-1/2'>
            <Image
              aria-hidden='true'
              className='hidden object-cover w-full h-full'
              src={imgSource}
              alt='Office'
              layout='fill'
            />
          </div>
          <main className='flex items-center justify-center p-6 sm:p-12 md:w-1/2'>
            <div className='w-full'>
              <h1 className='mb-8 text-xl font-semibold text-gray-700 dark:text-gray-200'>
                登录
              </h1>
              <Label>
                <span>用户名</span>
                <Input
                  className='mt-1'
                  type='text'
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  placeholder='请输入用户名'
                />
              </Label>

              <Button
                className='mt-8'
                block
                onClick={() => getUserInfo(userName)}
              >
                登录
              </Button>

              <hr className='my-8' />

              <p className='mt-1'>
                <Link href='/pages/create-account'>
                  <a className='text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline'>
                    注册账户
                  </a>
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalBody>
          确认登录？
        </ModalBody>
        <ModalFooter>
          <Button className="w-full sm:w-auto" layout="outline" onClick={closeModal}>
            取消
          </Button>
          <Button className="w-full sm:w-auto" onClick={doLogin}>确认</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default LoginPage
