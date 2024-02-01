local SandboxV2Hotfixer = Class("SandboxV2Hotfixer", HotfixBase);



local function _FixCheckIfSandboxInPlayerData(topicId)
  local hasData = CS.Torappu.UI.SandboxPerm.SandboxPermUtil.CheckIfSandboxInPlayerData(topicId);
  local playerSandboxPerm = CS.Torappu.PlayerData.instance.data.sandboxPerm;
  local isLocked = playerSandboxPerm == nil or playerSandboxPerm.isClose;
  return hasData and not isLocked;
end



local function _FixApplyEquipId(self,equipId)
  self:ApplyEquipId(equipId)
  if (self.basicCharInfo == null) then
    return
  end
  local playerChar = CS.Torappu.CharacterUtil.GetPlayerInstByCharId(self.basicCharInfo.charId)
  local charData = CS.Torappu.CharacterUtil.GetCharDataOrNull(CS.Torappu.CharQuery.FromPlayer(playerChar));

  self.branchGroupViewModel.rawFeatureDesc = charData:GetRawDescriptionFormatByTraitBlackboard
        (playerChar.level, playerChar.evolvePhase, playerChar.potentialRank)
  if (equipId == nil or equipId == "") then
    self.branchGroupViewModel.featureDescBasic = self.branchGroupViewModel.rawFeatureDesc;
  end
end

function SandboxV2Hotfixer:OnInit()
  xlua.private_accessible(CS.Torappu.UI.SandboxPerm.SandboxPermUtil);
  self:Fix_ex(CS.Torappu.UI.SandboxPerm.SandboxPermUtil, "CheckIfSandboxInPlayerData", function(topicId)
    local ok, value = xpcall(_FixCheckIfSandboxInPlayerData, debug.traceback, topicId);
    if not ok then
      LogError("[SandboxV2Hotfixer] fix" .. value);
    end
    return value;
  end);

  xlua.private_accessible(CS.Torappu.UI.SandboxPerm.SandboxV2.SandboxV2CharViewModel);
  self:Fix_ex(CS.Torappu.UI.SandboxPerm.SandboxV2.SandboxV2CharViewModel, "ApplyEquipId", function(self,equipId)
    local ok, value = xpcall(_FixApplyEquipId, debug.traceback,self, equipId);
    if not ok then
      LogError("[SandboxV2Hotfixer] fix" .. value);
    end
    return value;
  end);

end

function SandboxV2Hotfixer:OnDispose()
end

return SandboxV2Hotfixer;