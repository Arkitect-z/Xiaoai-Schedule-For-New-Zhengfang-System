/**
 * 时间配置函数，此为入口函数，不要改动函数名
 */
async function scheduleTimer() {
    await loadTool('AIScheduleTools')

    const showWeekend = await AIScheduleConfirm({
        titleText: '是否显示周末',
        contentText: '如果周末有课程，请打开该设置',
        cancelText: '不显示', // 取消按钮文字，可不传默认为取消
        confirmText: '显示', // 确认按钮文字，可不传默认为确认
    })

    return {
        totalWeek: 20, // 总周数：[1, 30]之间的整数
        startSemester: '', // 开学时间：时间戳，13位长度字符串，推荐用代码生成
        startWithSunday: false, // 是否是周日为起始日，该选项为true时，会开启显示周末选项
        showWeekend: showWeekend, // 是否显示周末
        forenoon: 5, // 上午课程节数：[1, 10]之间的整数
        afternoon: 4, // 下午课程节数：[0, 10]之间的整数
        night: 3, // 晚间课程节数：[0, 10]之间的整数
        sections: [
            {
                section: 1,
                startTime: "08:05",
                endTime: "08:50"
            },
            {
                section: 2,
                startTime: "08:55",
                endTime: "09:40"
            },
            {
                section: 3,
                startTime: "10:00",
                endTime: "10:45"
            },
            {
                section: 4,
                startTime: "10:50",
                endTime: "11:35"
            },
            {
                section: 5,
                startTime: "11:40",
                endTime: "12:25"
            },
            {
                section: 6,
                startTime: "13:30",
                endTime: "14:15"
            },
            {
                section: 7,
                startTime: "14:20",
                endTime: "15:05"
            },
            {
                section: 8,
                startTime: "15:15",
                endTime: "16:00"
            },
            {
                section: 9,
                startTime: "16:05",
                endTime: "16:50"
            },
            {
                section: 10,
                startTime: "18:30",
                endTime: "19:15"
            },
            {
                section: 11,
                startTime: "19:20",
                endTime: "20:05"
            },
            {
                section: 12,
                startTime: "20:10",
                endTime: "20:55"
            }
        ] // 课程时间表，注意：总长度要和上边配置的节数加和对齐
    }
}