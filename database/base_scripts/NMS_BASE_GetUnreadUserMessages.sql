
DROP procedure IF EXISTS `NMS_BASE_GetUnreadUserMessages`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetUnreadUserMessages` (IN paramToUserId INT(11))
BEGIN
	SELECT id, fromUserId, toUserId, message, status, seen, createdAt, updatedAt
 FROM messages 
WHERE 
seen = 0 
AND 
toUserId = paramToUserId;
END$$

DELIMITER ;

