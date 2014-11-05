
DROP procedure IF EXISTS `createResourceSecurityGroupMapping`;

CREATE PROCEDURE `createResourceSecurityGroupMapping` (IN paramResourceId INT(11),IN paramSecurityGroupId INT(11),IN paramCreate TINYINT(1),IN paramRead TINYINT(1),IN paramUpdate TINYINT(1),IN paramDelete TINYINT(1))
BEGIN
	INSERT INTO resourcesecuritygroupmappings 
(resourceId, securityGroupId, resourcesecuritygroupmappings.create, resourcesecuritygroupmappings.read, resourcesecuritygroupmappings.update, resourcesecuritygroupmappings.delete, createdAt, updatedAt) 
VALUES 
(paramResourceId, paramSecurityGroupId, paramCreate, paramRead, paramUpdate, paramDelete, UTC_TIMESTAMP(), UTC_TIMESTAMP());
END


