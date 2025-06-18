import React, { forwardRef, useRef } from 'react';
import { View, Text, Button, Input, Image } from '@tarojs/components'
import { useState, useEffect, useCallback } from 'react';
import { AtTag, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtAvatar, AtDrawer } from 'taro-ui'
import Taro from '@tarojs/taro';
import './me.scss'
import userStore from '../../store/user';
import { inject, observer } from 'mobx-react';


const Me = forwardRef((props, ref) => {
    // 权限信号，用于设置个人页面登录前后内容展示
    const [needAuth, setNeedAuth] = useState(true);
    // 开关信号，设置登录模态框的开关
    const [isOpened, setIsOpened] = useState(false);
    // 抽屉，控制更新修改个人信息抽屉的开关
    const [showDrawer, setShowDrawer] = useState(false)
    // ref实例，方便增删其事件监听
    const loginRef = useRef(null);
    // 用户头像url
    const [userAvatarUrl, setUserAvatarUrl] = useState('https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132')
    // 用户昵称
    const [userName, setUserName] = useState('微信用户')

    useEffect(() => {
        // loginRef.current.addEventListener('tap', OpenModal);
        // console.log(loginRef)
        console.log('Page loaded')
        // 写完每次都发现返回res.authSetting['scope.userInfo']为true，经查看微信官方文档，现在已经不适用这些api获取信息了，
        // getSetting拿到的一定是true授权，getUserInfo拿到的是匿名信息;
        // 于是转而想考虑使用getUserProfile，结果折腾半天getUserProfile也他妈停用了，它们觉得用wx.login就够了
        // 结果我跑去一看，这玩意给的是一个临时code，得授权，请求一个临时code，然后交给服务端，再处理，提交appid等等给微信
        // 微信才提供用户身份标识，不提别的，我就是搞个装模作样的授权，现在又叫我还得自己弄服务器，那我当然不干了
        // 本来就觉得教程里自己做一个model模态框还使用授权弹窗是脱裤子放屁，既然现在授权弹窗没有了，也就是没屁放了，
        // 但从学习的角度，我仍然可以做个模态框，而且不会有两个弹窗了，这样看起来就像是为了脱裤子而脱裤子，不会觉得在脱裤子放屁了
        // Taro.getSetting({
        //     success: function (res) {
        //         console.log(res);
        //         console.log(res.authSetting)
        //         // res.authSetting = {
        //         //   "scope.userInfo": true,
        //         //   "scope.userLocation": true
        //         // }
        //         if (res.authSetting['scope.userInfo'] === true) {
        //             console.log('来获取信息')
        //             Taro.getUserProfile({
        //                 desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        //                 success: (res) => {
        //                     // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        //                     // setUserInfo(res.userInfo);
        //                     // setHasUserInfo(true);
        //                     console.log(res.userInfo)
        //                 }
        //             })
        //         }
        //     }
        // })
    }, [])

    // 优化OpenModal函数，使用事件对象阻止冒泡
    const OpenModal = useCallback((e) => {
        // 阻止事件冒泡，避免影响内部元素的事件处理
        e.stopPropagation();
        setIsOpened(true);
    }, [setIsOpened]);

    function handleCancel() {
        setIsOpened(false);
    }

    function handleClose() {
        setIsOpened(false);
    }
    // function handleConfirm() {
    //     Taro.login({
    //         success: function (res) {
    //             if (res.code) {
    //                 console.log('登录成功')
    //                 // const viewref = loginRef.current
    //                 if (loginRef.current) {
    //                     loginRef.current.removeEventListener('tap', OpenModal)
    //                     console.log('移除成功')
    //                 }
    //                 setNeedAuth(false);
    //                 //     //     //发起网络请求
    //                 //     //     Taro.request({
    //                 //     //         url: 'https://test.com/onLogin',
    //                 //     //         data: {
    //                 //     //             code: res.code
    //                 //     //         }
    //                 //     // })
    //             } else {
    //                 console.log('登录失败！' + res.errMsg)
    //             }
    //         }
    //     })
    //     setIsOpened(false);
    // }

    async function handleConfirm() { // 确认授权
        try {
            const loginres = await Taro.login();
            if (loginres && loginres.code) {
                console.log('登录成功')
                console.log(loginres.code)
                const user = await userStore.wxLogin(loginres.code);
                // console.log(user)
                // console.log(user.data)
                setUserAvatarUrl(user.data.data.avatarUrl)
                setUserName(user.data.data.userName)
                if (loginRef.current) {
                    loginRef.current.removeEventListener('tap', OpenModal)
                    console.log('移除成功')
                }
                setNeedAuth(false);
            } else {
                console.log('登录失败！' + loginres.errMsg)
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsOpened(false);
        }
    }

    // 打开抽屉更新信息
    function updateInfo() {
        setShowDrawer(true)
    }

    // 获取并设置微信头像
    function onChooseAvatar(e) {
        const { avatarUrl } = e.detail
        setUserAvatarUrl(avatarUrl)
    }

    // 更新用户昵称
    function handleUserNameChange(e) {
        // console.log('更改') // 经测试每改一下就会执行一次
        setUserName(e.detail.value)
    }

    // 远程更新用户信息
    async function UpdateUserInfo() {
        const token = Taro.getStorageSync('token')
        let params = { token: token, avatarUrl: userAvatarUrl, userName: userName };
        if (token) {
            const resUpdate = await userStore.userInfo(params);
            console.log(resUpdate);
        } else {

        }
    }
    return (
        <View className='me' ref={ref}>
            {/* <AtTag type='primary' circle active>标签2</AtTag>
            <AtButton type='primary'>按钮文案</AtButton> */}
            {/* <Button open-type='getUserProfile' onGetUserProfile={getUserProfile}>授权登录</Button> */}
            <View ref={loginRef} onClick={OpenModal}>
                {
                    needAuth
                        ? <View className='userInfo '>
                            <AtAvatar className='userAvatar' circle image='https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'></AtAvatar>
                            {/* <AtAvatar className='userAvatar' circle image='../../assets/me.png'></AtAvatar> // 这种写法经测试不可行 */}
                            <Text className='userName'>请先授权登录</Text>
                        </View>
                        : <View>
                            <View className='userInfo'>
                                <AtAvatar className='userAvatar' circle image={userAvatarUrl}></AtAvatar>
                                <Text className='userName' onClickCapture={updateInfo}>{userName}</Text>
                            </View>
                            {/* <AtButton onClickCapture={updateInfo}>修改/更新信息</AtButton>  // 非常有意思，使用AtButton将无法使用update*/}
                            <Button onClickCapture={updateInfo}>修改/更新信息</Button> {/* 但普通的Button可以 */}
                            <Button onClickCapture={UpdateUserInfo}>修改/更新测试</Button>
                            {/* 关于这部分内容我想记录一下：
                            把具有点击触发的组件放到之前有过onclick的view里似乎都会失效，因此我把按钮拿出来，
                            果然可以使用了，但我尝试点击<Text className='userName' onClick={updateInfo}>微信用户</Text>，虽然没有反应，
                            但点完<Text className='userName' onClick={updateInfo}>微信用户</Text>，
                            再去点击放在外面能够正常使用的<AtButton onClick={updateInfo}>修改/更新信息</AtButton>，
                            我发现：
                            控制台先打印了10个“尝试使用抽屉”，再换行打印一个“尝试使用抽屉”；
                            这意味着我点击<Text className='userName' onClick={updateInfo}>是有反应的，只是似乎被什么东西阻塞住无法进行下去，
                            当我点击能够正常使用的<AtButton onClick={updateInfo}>修改/更新信息</AtButton>时它们就被释放出来了 */}

                            {/* 下面是原理
                            问题解决了，关键在于两个修改：
                            在OpenModal函数中添加了e.stopPropagation()；将onClick改为onClickCapture；
                            这两个修改都与 React/Taro 的事件处理机制密切相关。
                            冒泡和捕获是基础的概念，不赘述：
                            由于内外层的View都有点击事件，这会导致两个问题：
                            事件冲突：内外层的点击事件相互干扰；事件阻塞：外层事件可能阻止内层事件的正常处理
                            也许我需要回顾之前的问题，在授权之后，也就是处理授权的handleConfirm方法中，
                            为了实现登录前点击弹窗，登录后消除监听，有这样的语句
                            loginRef.current.removeEventListener('tap', OpenModal)
                            之前有过一个很无语的问题，如果我使用移除click，那么点击事件并不会被移除，还继续存在，对后续造成干扰，
                            这显然不是我想要的，当我注意到，打印实例对象身上并没有click的监听，而是有tap的监听，
                            于是我选择尝试修改为移除tap，尽管控制台在这个情况下，非常幽默地给出没有tap的监听，因此不会移除的警告；
                            但最后的效果是，监听被移除了，登陆成功后，点击不会再弹窗
                            当然，我也尝试过改为ontap，这样让移除tap显得理所当然，结果就是改为ontap，并不能像onclick一样被点击激活
                            ontap似乎是经过taro编译后的结果，但采用dom移除监听的方法taro并不能编译成tap，因此只能自己提前写成移除tap，
                            尽管会被警告，但它是唯一有效的解决方案。
                            但也许因为监听名义上真的还存在，导致出现了一些阻塞的干扰，因此，当我在内部使用onclick，冒泡，随后被
                            外层的onclick阻塞住，因为onclick默认是冒泡阶段处理的，因此内部改为onClickCapture，并不难理解，顾名思义，
                            把它改为捕获阶段执行，那么，就不会等冒泡的时候阻塞了；
                            当然，因为外部移除本身存在问题，所以它不应该被激活，那么就应该给外部设置阻止内部冒泡：
                            const OpenModal = useCallback((e) => {
                                // 阻止事件冒泡，避免影响内部元素的事件处理
                                e.stopPropagation();
                                setIsOpened(true);
                            }, [setIsOpened]);
                            e是内部的事件，也就是内部onclick被点击，会因为e.stopPropagation();而不冒泡，从而不激活外部的onclick，
                            这样也避免出现阻塞；
                            一个阻止冒泡激活外部有故障的onclick；另一个把执行阶段调整到捕获阶段，这样即使冒泡被阻止也能正常激活内部的onclick。
                            这个问题就解决了
                            */}

                            {/* 至于阻塞后，点击外部配置的按钮为什么能释放，原因可能比较复杂：
                            这涉及事件队列清空与批量处理机制：
                            当点击另一个元素时，会触发新的事件流，此时可能触发队列清空机制；
                            其中最有可能的就是React 的合成事件系统，它会在更新阶段统一处理事件队列

                            合成事件的底层实现：
                            React 为了性能优化，将原生事件（如 click）包装成合成事件（SyntheticEvent），并统一绑定到根节点
                            （document 或 container）。所有事件触发后不会立即执行，而是先存入 React 维护的事件队列，
                            等待 React 的更新周期统一处理。

                            事件队列的清空与批量执行逻辑：
                            当点击新元素时，会触发以下流程：
                            新事件入队：React 捕获到新点击事件，生成合成事件并加入队列。
                            批量更新机制：React 在事件处理阶段（如 componentDidUpdate 前）会开启一个 事务（Transaction），
                            将队列中的所有事件批量执行。
                            队列清空：事件处理完毕后，队列会被清空，避免重复执行。

                            案例说明：
                            假设快速点击元素 A 三次，再点击元素 B：点击 A 时，三次点击事件被存入 React 的事件队列，但未立即执行
                            （因 React 异步更新特性）。点击 B 时，React 触发新的事件处理流程，检测到队列中有未处理的事件（三次 A 的点击），
                            会将 A 的三次事件和 B 的事件一起批量执行，表现为 “积攒事件一次性触发”。
                            
                            总结分析：
                            因此，之前冒泡而导致阻塞，外部onclick事件虽然造成阻塞，但阻塞到后面，点击其他事件，就进入批量执行了；
                            批量执行显然是忽视了阻塞的外部onclick，由于前面特殊的操作，显然这个名存实亡的奇特事件的处理流程也变得不同寻常
                            */}

                            {/* 再来讲讲使用像上面那样解决问题后，把内部onclick放进内部按钮里，但AtButton失效，Button才有效的原因：
                            很显然这和AtButton的封装有关系，我觉得也没有必要特别细究：
                            只需要了解：onClickCapture是 React 的事件捕获阶段处理方式，但在 Taro UI 组件中可能受到以下限制：
                            组件内部阻止冒泡：AtButton可能在内部使用了e.stopPropagation()
                            事件委托机制：组件可能使用了不同的事件委托方式
                            版本兼容性：Taro UI 版本与 React 事件系统的兼容性问题
                            如果真的想知道，就应该查看AtButton的官方文档，确认是否有特殊的事件处理方式 */}
                            <Text>个人页面</Text>
                        </View>
                }
            </View>
            <AtModal
                isOpened={isOpened}
                title='授权提醒'
                cancelText='取消'
                confirmText='授权'
                onClose={handleClose}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
                content='获取您的登录许可'
            />
            <AtDrawer
                show={showDrawer}
                mask
                onClose={() => setShowDrawer(false)} // 添加关闭回调
            >
                {/* 注意open-type="chooseAvatar" 和 chooseAvatar={onChooseAvatar} 被绑定在 Button 组件上无效，Button是Taro组件，
                open-type="chooseAvatar" 是微信小程序的特殊属性，微信小程序的 chooseAvatar 事件需要绑定在 原生组件 上 */}
                <View className='updateTitle'>点击更新您的头像和昵称</View>
                <button
                    className="avatar-wrapper"
                    open-type="chooseAvatar"
                    onChooseAvatar={onChooseAvatar} // 直接使用onChooseAvatar，Taro会自动转换为bind:chooseavatar
                >
                    <Image className="avatar" src={userAvatarUrl} />
                </button>
                <input type="nickname" class="weui-input" placeholder="请输入昵称" value={userName} onInput={handleUserNameChange} />

                {/* <image class="avatar" src="{{avatarUrl}}"></image> */}
                {/* <View className='drawer-item'>这是自定义内容 <AtIcon value='home' size='20' /></View>
              <View className='drawer-item'>这是自定义内容</View> */}
            </AtDrawer>
        </View>
    )
})

// export default Me
export default inject('userStore')(observer(Me))
