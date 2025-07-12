document.getElementById('getAnalysis').addEventListener('click', async () => {
    try {
        // 获取图片的 Base64 编码
        let base64Image;
        const photo = document.getElementById('photo');
        if (photo.src) {
            base64Image = photo.src.split(',')[1]; // 去掉数据头，只保留 Base64 编码部分
        } else {
            throw new Error('请先拍照或选择一张图片');
        }

        // 使用 btoa 函数生成 Basic 格式的 Authorization 头部
        const username = 'yunshu';
        const password = '20250510';
        const authHeader = 'Basic ' + btoa(username + ':' + password);

        // 发送请求到代理服务器
        const response = await fetch('http://8.134.166.199:8888/api/v1/tongue-diagnosis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify({
                image_base64: base64Image,
                option: {
                    mask: false,
                    bbox: false
                }
            })
        });

        // 检查响应状态
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP 错误! 状态码: ${response.status}, 响应内容: ${errorText}`);
        }

        // 解析 JSON 数据
        const responseData = await response.json();

        // 调试输出完整响应
        console.log('完整响应数据:', responseData);

        // 格式化显示 JSON
        const formattedJSON = JSON.stringify(responseData, null, 2);
        document.getElementById('Analysis').innerHTML = `
            <pre>${formattedJSON}</pre>
        `;
    } catch (error) {
        // 更详细的错误处理
        console.error('请求失败详情:', {
            errorName: error.name,
            message: error.message,
            stack: error.stack
        });

        document.getElementById('Analysis').innerHTML = `
            <div style="color: red;">
                <p>请求失败: ${error.message}</p>
                <p>${error.name === 'SyntaxError' ? '响应不是有效 JSON 格式' : '网络或服务器错误'}</p>
            </div>
        `;
    }
});
