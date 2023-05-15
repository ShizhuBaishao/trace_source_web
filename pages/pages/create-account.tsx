import React, {
  useContext,
  useState,
} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import {
  newUser,
  IMyResponse,
  fetchUserInfo,
  IUserInfo,
  setRole, nodes,
} from 'api/user'
import {
  saveUserInfo,
} from 'utils/data'

import { WindmillContext, Input, Label, Button, Dropdown, DropdownItem } from '@roketid/windmill-react-ui'

function CreateAccount() {
  const { mode } = useContext(WindmillContext)
  const router = useRouter()
  const [userName, setUserName] = useState<string>('')
  const [roleId, setRoleId] = useState<number>(2)
  const [isOpen, setIsOpen] = useState(false)

  const imgSource = mode === 'dark' ? '/assets/img/create-account-office-dark.jpeg' : '/assets/img/create-account-office.jpeg'
  const roleList = ['生产商', '流通商', '待选择']

  function toggleDropdown() {
    setIsOpen(!isOpen)
  }

  function onRoleIdChange(id: number) {
    setRoleId(id)
    setIsOpen(false)
  }

  async function signUp({ userName }: { userName: string }) {
    // 未选择角色
    if (roleId === 2) {
      alert('请选择角色')
      return
    }

    const result = await newUser(userName) as IMyResponse
    if (result.message !== 'success') {
      alert('用户名已注册！')
    }

    const userInfo = await fetchUserInfo(userName) as IUserInfo
    let nodeResult = await getUserPermission(result.data.signUserId, result.data.address)
    console.log(nodeResult[1].toString())
    let isRegister = 0
    if (nodeResult[2] == "true") {
      isRegister = 1
    }
    saveUserInfo({ signUserId: userInfo.data.signUserId, address: userInfo.data.address, nodeType: roleId.toString(),isRegister: isRegister.toString()})

    await reqRole()
    // message: "Node already registered"
    onAccountCreated()
  }

  async function getUserPermission(signUserId: string,address: string) {
    const result: any = await nodes(signUserId, address)
    return result
  }

  async function reqRole() {
    const result = await setRole(userName, roleId) as IMyResponse
    return result
  }

  function onAccountCreated() {
    router.push('/pages/')
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className='mb-16 text-center text-4xl font-bold'>供应链溯源管理系统</div>
      <div className="h-full w-1/2 mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="relative h-32 md:h-auto md:w-1/2">
            <Image
              aria-hidden="true"
              className="object-cover w-full h-full"
              src={imgSource}
              alt="Office"
              layout='fill'
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-8 text-xl font-semibold text-gray-700 dark:text-gray-200">
                注册账户
              </h1>
              <Label>
                <span>用户名</span>
                <Input
                  className="mt-1"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  type="text"
                  placeholder="请输入用户名"
                />
              </Label>

              <div className="relative mt-8 flex flex-col flex-wrap">
                <div className='flex items-center gap-x-4'>
                  <Button onClick={toggleDropdown} aria-label="Notifications" aria-haspopup="true">
                    选择用户角色
                  </Button>
                  <span>当前用户角色：{roleList[roleId]}</span>
                </div>

                <Dropdown className='z-10' isOpen={isOpen} onClose={() => { }}>
                  <DropdownItem onClick={() => onRoleIdChange(0)}>
                    <span>{roleList[0]}</span>
                  </DropdownItem>
                  <DropdownItem onClick={() => onRoleIdChange(1)}>
                    <span>{roleList[1]}</span>
                  </DropdownItem>
                </Dropdown>
              </div>

              <Button
                block
                className="mt-8"
                onClick={() => signUp({ userName })}
              >
                创建账户
              </Button>

              <hr className="my-8" />

              <p className="mt-4">
                <Link href="/pages/login">
                  <a
                    className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    已经有账户了？点此登录
                  </a>
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default CreateAccount
