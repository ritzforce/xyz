CREATE TABLE IF NOT EXISTS `{$name}_user` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `role` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT 'user',
  `active` tinyint(1) DEFAULT NULL,
  `salt` varchar(1024) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(1024) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastModifiedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `name` (`name`,`email`),
  KEY `role` (`role`),
  KEY `active` (`active`)
) ENGINE=InnoDB AUTO_INCREMENT=258 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `{$name}_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastModifiedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `{$name}_exam` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `code` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(1024) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `category` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `maxMarks` int(11) DEFAULT NULL,
  `passPercent` int(11) DEFAULT NULL,
  `imageId` varchar(255) DEFAULT NULL,
  `createdDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `lastModifiedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdById` int(11) DEFAULT NULL,
  `lastModifiedById` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `timeAllowed` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`,`code`),
  KEY `createdById` (`createdById`),
  KEY `lastModifiedById` (`lastModifiedById`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `{$name}_paper` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `examId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `result` tinyint(1) DEFAULT NULL,
  `percent` int(11) DEFAULT NULL,
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastModifiedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(255) DEFAULT NULL,
  `timeTaken` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `examId` (`examId`),
  CONSTRAINT `{$name}_paper_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `{$name}_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `{$name}_paper_ibfk_2` FOREIGN KEY (`examId`) REFERENCES `{$name}_exam` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3348 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `{$name}_question` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `questionText` varchar(5000) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `a` varchar(1024) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `b` varchar(1024) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `c` varchar(1024) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `d` varchar(1024) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `e` varchar(1024) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `f` varchar(1024) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `aCorrect` tinyint(1) DEFAULT NULL,
  `bCorrect` tinyint(1) DEFAULT NULL,
  `cCorrect` tinyint(1) DEFAULT NULL,
  `dCorrect` tinyint(1) DEFAULT NULL,
  `eCorrect` tinyint(1) DEFAULT NULL,
  `fCorrect` tinyint(1) DEFAULT NULL,
  `examId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`),
  KEY `examId` (`examId`),
  KEY `active` (`active`),
  CONSTRAINT `{$name}_question_ibfk_1` FOREIGN KEY (`examId`) REFERENCES `{$name}_exam` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2961 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `{$name}_paperAnswer` (
  `paperId` int(11) NOT NULL,
  `answer` varchar(10) DEFAULT NULL,
  `correct` tinyint(1) DEFAULT NULL,
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastModifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `questionId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `paperId` (`paperId`),
  KEY `questionId` (`questionId`),
  CONSTRAINT `{$name}_paperAnswer_ibfk_1` FOREIGN KEY (`paperId`) REFERENCES `{$name}_paper` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `{$name}_paperAnswer_ibfk_2` FOREIGN KEY (`questionId`) REFERENCES `{$name}_question` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=70966 DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `{$name}_userExam` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `examId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastModifiedDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `examId` (`examId`,`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `{$name}_userexam_ibfk_1` FOREIGN KEY (`examId`) REFERENCES `{$name}_exam` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `{$name}_userexam_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `{$name}_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7251 DEFAULT CHARSET=latin1;


INSERT INTO `{$name}_category`  ( 
    SELECT * FROM admin_category
    WHERE id NOT IN
       ( SELECT Id
        FROM `{$name}_category`)
     AND name IN
       ( SELECT DISTINCT(category)
         FROM admin_exam
         WHERE Id IN
            ( SELECT examid
             FROM admin_shareexam
             WHERE instituteid = {$instituteId}) 
        ) 
   );


INSERT INTO `{$name}_exam` (id, imageId,timeAllowed, active, name, code, description, category, maxMarks,
  passPercent, createdDate, lastModifiedDate)  
SELECT id , imageId, timeAllowed, active, name, code, description, category, maxMarks,passPercent,createdDate, lastModifiedDate 
FROM admin_exam WHERE 
id NOT IN (select id from `{$name}_exam`) AND
id IN (SELECT examId FROM admin_shareexam WHERE instituteId = {$instituteId} );


INSERT INTO `{$name}_question` (`id`, `name`, `questionText`, `a`, `active`, `b`, `c`, `d`, `e`, `f`, `aCorrect`, `bCorrect`, `cCorrect`, `dCorrect`, `eCorrect`, `fCorrect`, `examId`)  
SELECT `id`, `name`, `questionText`, `a`, `active`, `b`, `c`, `d`, `e`, `f`, `aCorrect`, `bCorrect`, `cCorrect`, `dCorrect`, `eCorrect`, `fCorrect`, `examId` 
FROM admin_question WHERE 
id NOT IN (select id from `{$name}_question`) AND
examId IN (SELECT examId FROM admin_shareexam WHERE instituteId = {$instituteId});








