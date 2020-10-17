function weekStr2IntList(week) {
  // 将全角逗号替换为半角逗号
  let reg = new RegExp("，", "g");
  week.replace(reg, ',');
  let weeks = [];

  // 以逗号为界分割字符串，遍历分割的字符串
  week.split(",").forEach(w => {
      if (w.search('-') != -1) {
          let range = w.split("-");
          let start = parseInt(range[0]);
          let end = parseInt(range[1]);
          for (let i = start; i <= end; i++) {
              if (!weeks.includes(i)) {
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

function getSections(str) {
  let start = parseInt(str.split('-')[0])
  let end = parseInt(str.split('-')[1])
  let sections = []
  for (let i = start; i <= end; i++) {
      sections.push({ section: i })
  }
  return sections
}

function getTime(str) {
  let t = str.split('节)')
  let reg = new RegExp('周', 'g')
  let weekStr = t[1].replace(reg, '')
  let weeks = getWeeks(weekStr)
  return [weeks, getSections(t[0].replace('(', ''))]
}

function getWeeks(str) {
  let flag = 0
  if (str.search('单') != -1) {
      flag = 1
      str = str.replace('单', '')
  } else if (str.search('双') != -1) {
      flag = 2
      str = str.replace('双', '')
  }
  let weeks = weekStr2IntList(str)
  weeks = weeks.filter((v) => {
      if (flag === 1) {
          return v % 2 === 1
      } else if (flag === 2) {
          return v % 2 === 0
      }
      return v
  })
  return weeks
}

// 解析列表模式
function parseList(html) {
  let result = []
  const $ = cheerio.load(html, { decodeEntities: false });
  $('#kblist_table').find('tbody').each(function(weekday) {
      if (weekday > 0) {
          $(this).find('tr').each(function(index) {
              if (index > 0) {
                  let course = {}
                  $(this).find('td').each(function(i) {
                      if (i == 0) {
                          course.sections = getSections($(this).text())
                      } else {
                          course.name = $(this).find('.title').text()
                          let info = []
                          $(this).find('p font').each(function() {
                              let text = $(this).text().trim()
                              if (text.search('上课地点') != -1) {
                                  text = text.replace('上课地点：', '')
                              }
                              info.push(text.split('：')[1])
                          })
                          let reg = new RegExp('周', 'g')
                          let weekStr = info[0].replace(reg, '')
                          course.weeks = getWeeks(weekStr)
                          course.teacher = info[2]
                          course.position = info[1]
                          course.day = weekday
                      }
                  })
                  result.push(course)
              }
          })
      }
  })
  console.log(result)
  return result
}

// 解析表格模式
function parseTable(html) {
  const $ = cheerio.load(html, { decodeEntities: false });
  let result = []
  $('#kbgrid_table_0').find('td').each(function() {
      if ($(this).hasClass('td_wrap') && $(this).text().trim() !== '') {
          let info = []
          let weekday = parseInt($(this).attr('id').split('-')[0])
          $(this).find('font').each(function() {
              let text = $(this).text().trim()
              if (text !== '') {
                  info.push(text)
              }
          })
          console.log(info)
          let hasNext = true
          let index = 0
          while (hasNext) {
              let course = {}
              course.name = info[index]
              course.teacher = info[index + 3]
              course.position = info[index + 2]
              course.day = weekday
              if(info[index + 1]){
                  if(info[index + 1].split('节)')[1]){
                      let [weeks, sections] = getTime(info[index + 1])
                      course.weeks = weeks
                      course.sections = sections
                      result.push(course)
                  }
              }
              if (info[index + 7] !== undefined) {
                  index += 7
              } else  {
                  hasNext = false
              }
          }
      }
  })
  return result
}

function scheduleHtmlParser(html) {
  let result = []

  if ($('#type').text() === 'list') {
      result = parseList(html)
  } else {
      result = parseTable(html)
  }

  console.log(result.length)
  
  return { courseInfos: result }
}