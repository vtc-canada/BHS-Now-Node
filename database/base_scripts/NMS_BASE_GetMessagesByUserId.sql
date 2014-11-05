DROP procedure IF EXISTS `NMS_BASE_GetMessagesByUserId`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetMessagesByUserId`(IN v_id INT(11),IN v_where INT(11))
BEGIN
	SELECT * 
	FROM messages 
	WHERE (toUserId = v_id AND fromUserId = v_where) 
		OR (fromUserId = v_id AND toUserId = v_where) 
	ORDER BY createdAt 
	DESC LIMIT 20;
END$$

DELIMITER ;

