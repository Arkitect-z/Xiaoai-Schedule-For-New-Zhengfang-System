async function scheduleHtmlProvider(dom = document) {
    // 引入小爱课程表工具箱
    await loadTool('AIScheduleTools')
    
    let providerRes = dom.querySelector('body').outerHTML
    if (providerRes.indexOf("节/周") == -1) {
        await AIScheduleAlert('请单击左上角齿轮，显示【时间】字段')
        return "do not continue"
    }
    return providerRes
}