DROP procedure IF EXISTS `NMS_BASE_GetDistinctMessages`;
DELIMITER $$

CREATE PROCEDURE `NMS_BASE_GetDistinctMessages`(IN v_id INT(11))
BEGIN
	SELECT * 
	FROM (SELECT * 
			FROM ((SELECT *
					,fromUserId AS joinuserId  
					FROM messages 
					WHERE toUserId = v_id
					) 
					UNION 
				  (SELECT *
				  ,toUserId AS joinuserId 
				  FROM messages 
				  WHERE fromUserId = v_id)
				) AS T1 
			ORDER BY createdAt 
			DESC 
		 ) AS T2 
	GROUP BY joinuserId;
END