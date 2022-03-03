// 解析【节/周】数据
function getTime(str) {
    let t = str.split('节)')
    let reg = new RegExp('周', 'g')
    let weekStr = t[1].replace(reg, '')
    let weeks = getWeeks(weekStr)
    return [weeks, getSections(t[0].replace('(', ''))]
}

// 解析周数据
function getWeeks(week) {
    // 将全角逗号替换为半角逗号
    week.replace("，", ',');
    let weeks = [];

    // 以逗号为界分割字符串，遍历分割的字符串
    week.split(",").forEach(w => {
        if (w.search('-') != -1) {
            let flag = 0
            if (w.search('单') != -1) {
                flag = 1
                w = w.replace('(单)', '')
            } else if (w.search('双') != -1) {
                flag = 2
                w = w.replace('(双)', '')
            }

            let range = w.split("-");
            let start = parseInt(range[0]);
            let end = parseInt(range[1]);
            for (let i = start; i <= end; i++) {
                if (!weeks.includes(i) && (flag == 0 || (flag == 1 && i % 2 == 1) || (flag == 2 && i % 2 == 0))) {
                    weeks.push(i);
                }
            }
        } else if (w.length != 0) {
            let v = parseInt(w);
            if (!weeks.includes(v)) {
                weeks.push(v);
            }
        }
    });
    return weeks;
}

// 解析节数据
function getSections(str) {
    let start = parseInt(str.split('-')[0])
    let end = parseInt(str.split('-')[1])
    let sections = []
    for (let i = start; i <= end; i++) {
        sections.push(i)
    }
    return sections
}

// 入口函数
function scheduleHtmlParser(html) {
    var result = new Array()

    $('#kbgrid_table_0').find('td').each(function () {
        // 遍历课程表

        $(this).find('[class^="timetable_con"]').each(function () {
            // 课表信息存储在class=timetable_con的div块中

            let course = {}
            course.name = $(this).find('[class^="title"]').text().trim().replace('【调】', '')
            course.day = parseInt($(this).parent().attr('id').split('-')[0])
            course.sections = ''
            course.teacher = ''
            course.position = ''

            $(this).find('p').each(function () {
                switch ($(this).find('span').attr('title')) {
                    case "节/周":
                        course.sections = $(this).text().trim()
                        break
                    case "教师":
                        course.teacher = $(this).text().trim()
                        break
                    case "上课地点":
                        course.position = $(this).text().trim()
                        break
                }
            })

            // 格式化文本
            if (course.sections == '') {
                console.log("error: 请单击左上角齿轮显时间字段")
                return
            }
            let [weeks, sections] = getTime(course.sections)
            course.weeks = weeks
            course.sections = sections

            if (course.position != '') {
                course.position = course.position.replace('下沙 ', '').replace(/第([0-9]{1,2})教研楼/, '$1教')
            }

            result.push(course)
        })
    })

    console.info(result)
    return result
}
