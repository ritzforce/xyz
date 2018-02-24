select 'Summary','Exam', count(*) AS Count from `{$name}_exam`
UNION
select 'Summary','User', count(*) AS Count from `{$name}_user` where role='user'
UNION
select 'Summary','Paper', count(*) AS Count from `{$name}_paper`
UNION
select 'User',user.name, count(*) AS Count
FROM `{$name}_paper` AS paper inner join `{$name}_user` as user ON paper.userId = user.id 
WHERE user.active = true  AND status = 'complete' 
Group by paper.userId
Limit 5
UNION
select 'Exam',exam.name, count(*) AS Count
FROM `{$name}_paper` AS paper inner join `{$name}_exam` as exam ON paper.examId = exam.id 
WHERE exam.active = true  AND status = 'complete' 
Group by paper.examId
Limit 5