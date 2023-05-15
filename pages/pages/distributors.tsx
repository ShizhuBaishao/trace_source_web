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


function Distributors() {
    const [productList, setProductList] = useState<IProductInfo[]>([])
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
    //0游离状态 1 验证状态 2 流转状态
    const [productStatusList, setProductStatusList] = useState<number[]>([]);

    // 添加产品弹窗状态
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)
    // 流通产品弹窗状态
    const [isTransferModalopen, setIsTransferModalopen] = useState(false)
    // 产品详情弹窗状态
    const [isProductDetailModalOpen, setIsProductDetailModalOpen] = useState(false)

    //@param num 标识弹出哪个窗囗 1: 验证产品, 2: 流通产品， 3: 产品详情
    function openModal(num: number, prod: IProductInfo) {
        const isRegister = localStorage.getItem('isRegister')
        if (isRegister === '0') {
            alert('未审核通过，请联系管理员！')
            return
        }
        if (num === 1) {
            setProductDetail(prod)
            setIsVerifyModalOpen(true)
        } else if (num === 2) {
            setProductDetail(prod)
            setIsTransferModalopen(true)
        } else if (num === 3) {
            setProductDetail(prod)
            setIsProductDetailModalOpen(true)
        }
    }

    function closeModal(num: number) {
        if (num === 1) {
            setIsVerifyModalOpen(false)
        } else if (num === 2) {
            setIsTransferModalopen(false)
        } else if (num === 3) {
            setIsProductDetailModalOpen(false)
        }
    }

    useEffect(() => {
        const nodeType = localStorage.getItem('nodeType')
        if (nodeType === '0') {
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
        let productStatusList: number[] = []
        for (let i = 0; i < prodsArr.length; i++) {
            let [productInfo, owner, paused, chainTraces] = await getProduct(prodsArr[i]) as any

            let productInfoData = parseStringAsArray(productInfo)
            console.log("info===: ", productInfoData)
            let productInfoTmp: IProduct = {
                productName: productInfoData[0].replace(/^"(.*)"$/, '$1'), // 去除首尾双引号
                producerName: productInfoData[1].replace(/^"(.*)"$/, '$1'),
                productionDate: productInfoData[2].replace(/^"(.*)"$/, '$1'),
                location: productInfoData[3].replace(/^"(.*)"$/, '$1'),
                batchNumber: productInfoData[4].replace(/^"(.*)"$/, '$1'),
                ingredients: parseStringAsArray(productInfoData[5]),
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

            console.log("chainTracesTmp===: ", chainTracesTmp)
            //如果chainTracesTmp包含当前用户，则添加productList添加该产品
            let isUserInChainTraces = chainTracesTmp.some(trace => trace.node.nodeAddress === localStorage.getItem('address'));
            console.log("isUserInChainTraces===: ", isUserInChainTraces)

            if (isUserInChainTraces) {

                let product: IProductInfo = {
                    productInfo: productInfoTmp,
                    productHash: prodsArr[i],
                    owner: owner,
                    paused: paused,
                    chainTraces: chainTracesTmp,
                }
                // 判断条件：
                // 1. 用户若不是最后一个节点，则productStatus为0
                // 2. 用户为最后一个节点，验证状态为false，则productStatus为1
                // 3. 用户为最后一个节点，验证状态为true，则productStatus为2
                if (chainTracesTmp[chainTracesTmp.length - 1].node.nodeAddress !== localStorage.getItem('address')) {
                    productStatusList.push(0)
                }else if(chainTracesTmp[chainTracesTmp.length - 1].node.nodeAddress === localStorage.getItem('address') && !chainTracesTmp[chainTracesTmp.length - 1].isVerified){
                    productStatusList.push(1)
                }else if(chainTracesTmp[chainTracesTmp.length - 1].node.nodeAddress === localStorage.getItem('address') && chainTracesTmp[chainTracesTmp.length - 1].isVerified){
                    productStatusList.push(2)
                }
                productList.push(product)
            }

        }

        setProductList(productList)
        setProductStatusList(productStatusList)
        console.log("productList===: ", productList)
    }

    const parseStringAsArray = (str: string) => {
        return str
            .replace(/\[(.*)\]/, '$1')
            .split(',')
            .map(i => i.trim())
    }

    // 验证产品
    const verify = async (productHash: string) => {
        let tx = await verifyProduct(localStorage.getItem('signUserId')!, productHash) as any
        if (tx.statusOK) {
            alert('验证成功！')
            await getAllProds()
            closeModal(1)
        } else {
            alert('验证失败！错误信息：' + tx.message)
        }
    }

    // 流通产品
    const transfer = async (productHash: string) => {
        let tx = await transferProduct(localStorage.getItem('signUserId')!, [transferNewAddr, productHash]) as any
        if (tx.statusOK) {
            alert('流转成功！')
            await getAllProds()
            closeModal(2)
        } else {
            alert('流通失败！错误信息：' + tx.message)
        }
    }


    return (
        <Layout>
            <PageTitle>流通管理</PageTitle>
            <div>

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
                                            {productStatusList[i] == 1 ?
                                                <Button onClick={() => openModal(1, prod)}> 验证 </Button>
                                                : productStatusList[i] == 2 ?
                                                    <Button onClick={() => openModal(2, prod)}> 流转 </Button>
                                                    : " "
                                            }
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Modal onClose={() => closeModal(1)} isOpen={isVerifyModalOpen}>
                    <ModalHeader>验证产品</ModalHeader>
                    <ModalBody>
                        <div className='flex items-center gap-x-4'>
                            <span className="w-20 text-sm">产品名称：</span>
                            {productDetail.productInfo.productName}
                        </div>
                        <div className='flex items-center gap-x-4'>
                            <span className="w-20 text-sm">产品哈希：</span>
                            {productDetail.productHash}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => verify(productDetail.productHash)}>验证</Button>
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
                                    <TableCell>{productDetail.productInfo.ingredients}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>产品哈希</TableCell>
                                    <TableCell>{productDetail.productHash}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>产品流通详情</TableCell>
                                    <TableCell>{productDetail.chainTraces.map((trace, i) => (
                                        <div key={i}>
                                            <div><b>{i === 0 ? "出厂" : "第 " + i + " 次流通"}</b></div>
                                            <div>节点地址：{trace.node.nodeAddress}</div>
                                            <div>节点类型：{trace.node.nodeType == 0 ? "生产商" : trace.node.nodeType === 1 ? "流通商" : "Regulator"}</div>
                                            <div>节点状态：{trace.node.isRegistered ? "已审核" : "未审核"}</div>
                                            <div>流通时间：{`${new Date(trace.timestamp).getFullYear()}-${new Date(trace.timestamp).getMonth() + 1}-${new Date(trace.timestamp).getDate()} ${new Date(trace.timestamp).getHours()}:${new Date(trace.timestamp).getMinutes()}:${new Date(trace.timestamp).getSeconds()}`}</div>
                                            <div>流通状态：{trace.isVerified ? "已验证" : "未验证"}</div>
                                        </div>
                                    ))}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </ModalBody>
                </Modal>

            </div>



        </Layout>
    )
}

export default Distributors
