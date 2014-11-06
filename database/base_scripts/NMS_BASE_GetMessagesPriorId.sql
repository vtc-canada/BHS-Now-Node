DROP procedure IF EXISTS `NMS_BASE_GetMessagesPriorId`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetMessagesPriorId` (IN paramPriorId INT(11), IN paramBoxId INT(11), IN paramUserId INT(11))
BEGIN
	SELECT id, fromUserId, toUserId, message, status, seen, createdAt, updatedAt
 FROM messages 
WHERE 
IF(paramPriorId IS NULL,1,id < paramPriorId)
AND
((fromUserId = paramUserId AND toUserId = paramBoxId)||(fromUserId = paramBoxId AND toUserId = paramUserId))
ORDER BY id DESC
LIMIT 25;
END$$

DELIMITER ;

