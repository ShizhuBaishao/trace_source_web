import React, {useEffect, useState} from 'react'

import {
    Input,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHeader,
    TableRow,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@roketid/windmill-react-ui'
import PageTitle from 'components/Typography/PageTitle'

import Layout from 'containers/Layout'

import {
    IProduct,
    IProductInfo,
    IChainTrace,
    addProduct,
    getProduct,
    getAllProducts,
    transferProduct,
    verifyProduct,
} from 'api/user'


function Forms() {
    const [productList, setProductList] = useState<IProductInfo[]>([])
    const [product, setProduct] = useState<IProduct>({
        productName: '',
        producerName: '',
        productionDate: '',
        location: '',
        batchNumber: '',
        ingredients: [],
    })
    const [transferNewAddr, setTransferNewAddr] = useState('')
    const [productDetail, setProductDetail] = useState<IProductInfo>({
        productInfo: {  
            productName: '',
            producerName: '',
            productionDate: '',
            location: '',
            batchNumber: '',
            ingredients: [],
        },
        productHash: '',
        owner: '',
        paused: false,
        chainTraces: [],
    })

    // 添加产品弹窗状态
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
    // 流通产品弹窗状态
    const [isTransferModalopen, setIsTransferModalopen] = useState(false)
    // 产品详情弹窗状态
    const [isProductDetailModalOpen, setIsProductDetailModalOpen] = useState(false)

    //@param num 标识弹出哪个窗囗 1: 添加产品, 2: 流通产品， 3: 产品详情
    function openModal(num: number, prod: IProductInfo) {
        const isRegister = localStorage.getItem('isRegister')
        if (isRegister === '0') {
            alert('未审核通过，请联系管理员！')
            return
        }
        if (num === 1) {
            setIsAddProductModalOpen(true)
        }else if (num === 2) {
            setProductDetail(prod)
            setIsTransferModalopen(true)
        }else if (num === 3) {
            setProductDetail(prod)
            setIsProductDetailModalOpen(true)
        }
    }

    function closeModal(num: number) {
        if (num === 1) {
            setIsAddProductModalOpen(false)
        }else if (num === 2) {
            setIsTransferModalopen(false)
        }else if (num === 3) {
            setIsProductDetailModalOpen(false)
        }
    }

    useEffect(() => {
        const nodeType = localStorage.getItem('nodeType')
        if (nodeType === '1') {
            // 执行权限不足的处理逻辑，例如跳转到其他页面或显示提示信息
            alert('您没有权限访问该页面！')
            window.location.href = '/pages' // 跳转到其他页面
        } else {
            getAllProds()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    async function getAllProds() {
        const prods = await getAllProducts() as any

        let prodsArr: string[] = []
        prodsArr = parseStringAsArray(prods[0])

        let productList: IProductInfo[] = []
        for (let i = 0; i < prodsArr.length; i++) {
            let [productInfo, owner, paused, chainTraces] = await getProduct(prodsArr[i]) as any

            console.log("productInfo===: ", productInfo)
            // let productInfoData = parseStringAsArray(productInfo)
            let productInfoData = JSON.parse(productInfo)
            console.log("info===: ", productInfoData)
            let productInfoTmp: IProduct = {
                productName: productInfoData[0], // 去除首尾双引号
                producerName: productInfoData[1],
                productionDate: productInfoData[2],
                location: productInfoData[3],
                batchNumber: productInfoData[4],
                ingredients: productInfoData[5],
            }

            let chainTracesData = JSON.parse(chainTraces);
            let chainTracesTmp: IChainTrace[] = chainTracesData.map(
                ([nodeData, isVerified, timestamp]: [
                    Array<string | number | boolean>,
                    boolean,
                    number
                ]) => ({
                    node: {
                        nodeAddress: nodeData[0] as string,
                        nodeType: nodeData[1] as number,
                        isRegistered: nodeData[2] as boolean,
                    },
                    isVerified,
                    timestamp,
                })
            );
            
            // 溯源列表中，第一条记录的生产商是当前用户才显示
            if (chainTracesTmp[0].node.nodeAddress === localStorage.getItem('address')) {
                let product: IProductInfo = {
                    productInfo: productInfoTmp,
                    productHash: prodsArr[i],
                    owner: owner,
                    paused: paused,
                    chainTraces: chainTracesTmp,
                }
                productList.push(product)
            }
        }

        setProductList(productList)
    }

    const parseStringAsArray = (str: string) => {
        return str
            .replace(/\[(.*)\]/, '$1')
            .split(',')
            .map(i => i.trim())
    }

    async function handleAddProduct() {
        // 校验和判空逻辑
        if (product.productName.trim() === '') {
            alert('产品名称不能为空')
            return
        }
        if (product.producerName.trim() === '') {
            alert('生产商名称不能为空')
            return
        }
        if (product.productionDate.trim() === '') {
            alert('生产日期不能为空')
            return
        }
        if (product.location.trim() === '') {
            alert('产地不能为空')
            return
        }
        if (product.batchNumber.trim() === '') {
            alert('批次编号不能为空')
            return
        }
        if (product.ingredients.length === 0) {
            alert('原料清单不能为空')
            return
        }
        const tx = await addProduct(localStorage.getItem('signUserId')!, product) as any
        if (tx.statusOK) {
            alert('添加成功')
            closeModal(1)
            await getAllProds()
        } else {
            alert('添加失败！错误信息：' + tx.message)
        }

        await getAllProds()
    }

    // 流通产品
    const transfer = async ( productHash: string) => {
        const tx = await transferProduct(localStorage.getItem('signUserId')!, [transferNewAddr, productHash]) as any
        if (tx.statusOK) {
            alert('流转成功') 
            await getAllProds()
            closeModal(2)        
        } else {
            alert('流转失败！错误信息：' + tx.message)
        }
    }

    return (
        <Layout>
            <PageTitle>产品管理</PageTitle>
            <div>
              <Modal onClose={() => closeModal(1)} isOpen={isAddProductModalOpen}>
                  <ModalHeader>添加产品</ModalHeader>
                  <ModalBody>
                      <div className='flex items-center gap-x-4'>
                          <span className="w-20 text-sm">产品名称</span>
                          <Input
                              value={product.productName}
                              onChange={(e) => setProduct({
                                  ...product,
                                  productName: e.target.value,
                              })}
                          />
                      </div>
                      <div className='flex items-center gap-x-4'>
                          <span className="w-20 text-sm">生产商名称</span>
                          <Input
                              value={product.producerName}
                              onChange={(e) => setProduct({
                                  ...product,
                                  producerName: e.target.value,
                              })}
                          />
                      </div>
                      <div className='flex items-center gap-x-4'>
                          <span className="w-20 text-sm">生产日期</span>
                          <Input
                              value={product.productionDate}
                              onChange={(e) => setProduct({
                                  ...product,
                                  productionDate: e.target.value,
                              })}
                          />
                      </div>
                      <div className='flex items-center gap-x-4'>
                          <span className="w-20 text-sm">产地</span>
                          <Input
                              value={product.location}
                              onChange={(e) => setProduct({
                                  ...product,
                                  location: e.target.value,
                              })}
                          />
                      </div>
                      <div className='flex items-center gap-x-4'>
                          <span className="w-20 text-sm">批次编号</span>
                          <Input
                              value={product.batchNumber}
                              onChange={(e) => setProduct({
                                  ...product,
                                  batchNumber: e.target.value,
                              })}
                          />
                      </div>
                      <div className='flex items-center gap-x-4'>
                          <span className="w-20 text-sm">原料清单</span>
                          <Input
                              value={product.ingredients}
                              onChange={(e) => setProduct({
                                  ...product,
                                  ingredients: e.target.value.split(',')
                              })}
                          /> 
                          <br />多种原料使用英文逗号（,）分隔
                      </div>
                  </ModalBody>
                  <ModalFooter>
                      <Button onClick={handleAddProduct}>添加产品</Button>
                  </ModalFooter>
              </Modal>

              <Modal onClose={() => closeModal(2)} isOpen={isTransferModalopen}>
                  <ModalHeader>流转产品</ModalHeader>
                  <ModalBody>
                      <div className='flex items-center gap-x-4'>
                          <span className="w-20 text-sm">产品名称：</span>
                          {productDetail.productInfo.productName}
                      </div>
                      <div className='flex items-center gap-x-4'>
                          <span className="w-20 text-sm">产品哈希：</span>
                          {productDetail.productHash}
                      </div>
                      <div className='flex items-center gap-x-4'>
                          <span className="w-20 text-sm">流通商节点地址：</span>
                          <Input
                              name='transferNewAddr'
                              value={transferNewAddr}
                              onChange={(e) => setTransferNewAddr(e.target.value)}
                          />
                      </div>
                  </ModalBody>
                  <ModalFooter>
                      <Button onClick={() => transfer(productDetail.productHash)}>流转</Button>
                  </ModalFooter>
              </Modal>
              
              <Modal onClose={() => closeModal(3)} isOpen={isProductDetailModalOpen}>
                  <ModalHeader>产品详情</ModalHeader>
                  <ModalBody>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell>产品名称</TableCell>
                            <TableCell>{productDetail.productInfo.productName}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>生产商名称</TableCell>
                            <TableCell>{productDetail.productInfo.producerName}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>生产日期</TableCell>
                            <TableCell>{productDetail.productInfo.productionDate}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>产地</TableCell>
                            <TableCell>{productDetail.productInfo.location}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>批次编号</TableCell>
                            <TableCell>{productDetail.productInfo.batchNumber}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>原料清单</TableCell>
                            <TableCell>{productDetail.productInfo.ingredients}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>产品哈希</TableCell>
                            <TableCell>{productDetail.productHash}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>产品流通详情</TableCell>
                            <TableCell>{productDetail.chainTraces.map((trace,i) => (
                              <div key={i}>
                                <div><b>{i === 0 ? "出厂" : "第 " + i +" 次流通"}</b></div>
                                <div>节点地址：{trace.node.nodeAddress}</div>
                                <div>节点类型：{trace.node.nodeType == 0 ? "生产商": trace.node.nodeType === 1 ? "流通商" : "Regulator"}</div>
                                <div>节点状态：{trace.node.isRegistered ? "已审核" : "未审核"}</div>
                                <div>流通时间：{`${new Date(trace.timestamp).getFullYear()}-${new Date(trace.timestamp).getMonth()+1}-${new Date(trace.timestamp).getDate()} ${new Date(trace.timestamp).getHours()}:${new Date(trace.timestamp).getMinutes()}:${new Date(trace.timestamp).getSeconds()}`}</div>
                                <div>流通状态：{trace.isVerified ? "已验证" : "未验证"}</div>
                              </div>
                            ))}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                  </ModalBody>
              </Modal>
            </div>
            <div className="mt-4 flex items-start">
                <Button onClick={() => openModal(1, productDetail)}>添加产品</Button>
            </div>

            <TableContainer className="mb-8">
                <Table>
                    <TableHeader>
                        <tr>
                            <TableCell>产品名称</TableCell>
                            <TableCell>生产商名称</TableCell>
                            <TableCell>生产日期</TableCell>
                            <TableCell>产地</TableCell>
                            <TableCell>批次编号</TableCell>
                            <TableCell>操作</TableCell>
                        </tr>
                    </TableHeader>
                    <TableBody>
                        {productList.map((prod, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <div className="flex items-center text-sm">
                                        {prod.productInfo.productName}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center text-sm">
                                        {prod.productInfo.producerName}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center text-sm">
                                        {prod.productInfo.productionDate}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center text-sm">
                                        {prod.productInfo.location}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center text-sm">
                                        {prod.productInfo.batchNumber}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center text-sm">
                                      <Button onClick={() => openModal(3, prod)}> 详情 </Button>
                                      &nbsp;&nbsp;
                                      {prod.chainTraces.length == 1 ? <Button onClick={() => openModal(2, prod)}> 流转 </Button> : ""}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Layout>
    )
}

export default Forms
