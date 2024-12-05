

local xutil = require('xlua.util')



local V056Hotfixer = Class("V056Hotfixer", HotfixBase)

local ClsHotUpdater = CS.Torappu.Resource.HotUpdater
local UnityUI = CS.UnityEngine.UI
local TorappuUI = CS.Torappu.UI
local TorappuBuildingUI = CS.Torappu.Building.UI

local function Fix_CalcUpdateResParams(newUpdateInfo, persistentResInfo, downloadPart)
  local result = ClsHotUpdater._CalcUpdateResParams(newUpdateInfo, persistentResInfo, downloadPart)
  local removeResList = result.removeResList
  if removeResList.Count == 0 then
    return result
  end
  local allValidBundles = {}
  if newUpdateInfo ~= nil and newUpdateInfo.abInfos ~= nil then
    local bundleList = newUpdateInfo.abInfos
    for i = 0, bundleList.Length - 1 do
      local bundle = bundleList[i]
      allValidBundles[bundle.name] = true
    end
  end
  
  for i = removeResList.Count -1, 0, -1 do
    local bundle = removeResList[i]
    local isValid = allValidBundles[bundle.name]
    if isValid then
      removeResList:RemoveAt(i)
    end
  end

  return result
end

local function Fix_BuildingStationManageEditQueueStateInitIfNot(self)
  if self.m_isInited then
    return
  end
  
  self:_InitIfNot()
  
  local backBgTransform = self._background.transform
  local backBgGo = backBgTransform.gameObject
  local backButton = backBgGo:GetComponent(typeof(UnityUI.Button))
  
  backButton.transition = UnityUI.Selectable.Transition.None

  local childRectTransform = CS.Torappu.GameObjectUtil.CreateUIObject("raycast", backBgTransform)
  local childGo = childRectTransform.gameObject
  childGo:AddComponent(typeof(CS.NonDrawingGraphic))

  local childButton = childGo:AddComponent(typeof(UnityUI.Button))
  childButton.onClick = backButton.onClick
  childRectTransform.anchorMin = {x = 0, y = 1}
  childRectTransform.anchorMax = {x = 0, y = 1}
  childRectTransform.anchoredPosition = {x = 50, y = -50}
  CS.Torappu.Lua.LuaUIUtil.BindBackPressToButton(childButton)
end

local function Fix_BuildingWorkShop_TryToSetWorkCount(self, targetCount)
  local char = self.workshopModel.stationaryCharacter
  return self:TryToSetWorkCount(targetCount)
end

local function Fix_BuildingWorkShop_OnIngredientJumpBtnPressed(self, index)
  local value = self._stateBean.property.Value;
  if (value == nil) then
    return;
  end
  local workshopModel = value.workshopModel;
  if (workshopModel == nil) then
    return;
  end
  local currentFormula = workshopModel.currentFormula;
  if (currentFormula == nil) then
    return;
  end
  local jumpTargetFormulaItem = nil
  if (index == 0) then
    jumpTargetFormulaItem = currentFormula.ingredient1
  end
  if (index == 1) then
    jumpTargetFormulaItem = currentFormula.ingredient2
  end
  if (index == 2) then
    jumpTargetFormulaItem = currentFormula.ingredient3
  end
  if (jumpTargetFormulaItem ==nil) then
    return
  end

  local ingredientItemFormula = workshopModel:FindFormulaByItemId(jumpTargetFormulaItem.model.itemId);
  if (ingredientItemFormula == nil) then
    return;
  end
  if (not ingredientItemFormula.unlocked) then
    CS.Torappu.UI.UINotification.LockToast(ingredientItemFormula.unlockMessage);
    return;
  end
  self:OnIngredientJumpBtnPressed(index)
end

local function Fix_StationManage_GetPreQueueStatus(buildingModel, slotId, queue)
  local queueInfoModel = TorappuBuildingUI.SM.StationManageUtil.GetPreQueueStatus(buildingModel, slotId, queue)
  local curStatus = queueInfoModel.status:GetHashCode() & (~(1 << 2))
  for i = 0, queue.Count - 1 do
    local instId = queue[i]
    if instId >= 0 then
      local charModel = buildingModel:GetBuildingCharByInstId(instId)
      if charModel.isEmpty then
        local playerChar
        _, playerChar = buildingModel.playerChars:TryGetValue(tostring(instId))
        if playerChar ~= nil then
          charModel = CS.Torappu.Building.BuildingCharModel.CreateModel(instId, playerChar)
        end
      end
      local slotModelCurCharIn = buildingModel:GetSlotById(charModel.slotId)
      if charModel.slotId ~= slotId and slotModelCurCharIn ~= nil and slotModelCurCharIn.roomId ~= CS.Torappu.BuildingData.RoomType.DORMITORY then
        curStatus = curStatus | (1 << 2)
      end
    end
  end
  queueInfoModel.status = TorappuBuildingUI.SM.PreQueueStatus.__CastFrom(curStatus)

  return queueInfoModel
end

local function Fix_FireworkCraftModel_LoadData(self, input)
  if input.source == CS.Torappu.UI.Firework.FireworkCraft.FireworkCraftModel.OpenSource.STAGE then
    local curTs = CS.Torappu.DateTimeUtil.timeStampNow;
    local inputStageId = input.defaultStageId;
    local inputStageData = CS.Torappu.StageDataUtil.GetStageOrNull(inputStageId, curTs);
    if inputStageData == nil then
      return
    end
    if inputStageData.difficulty == CS.Torappu.LevelData.Difficulty.FOUR_STAR then
      local normalStageId = CS.Torappu.StageDB.instance:GetNormalStageId(inputStageId);
      input.defaultStageId = normalStageId;
    end
  end
  self:LoadData(input)
end

local function Fix_Act1VAutoChessShopQuickAssist_TryRefreshNormalItemView(self, arg1)
  if self.view == nil then
    return;
  end
  self.view:Render(arg1);
end

local function Fix_Act1VAutoChessShopQuickAssist_TryRefreshTitleItemView(self, arg1)
  if self.view == nil then
    return;
  end
  self.view:Render(arg1);
end

function V056Hotfixer:OnInit()
  xlua.private_accessible(ClsHotUpdater);
  self:Fix_ex(ClsHotUpdater, "_CalcUpdateResParams", function(newUpdateInfo, persistentResInfo, downloadPart)
    local ok, ret = xpcall(Fix_CalcUpdateResParams, debug.traceback, newUpdateInfo, persistentResInfo, downloadPart)
    if not ok then
      LogError("Failed to fix HotUpdater._CalcUpdateResParams:" .. ret)
      return ClsHotUpdater._CalcUpdateResParams(newUpdateInfo, persistentResInfo, downloadPart)
    end
    return ret
  end)
  xlua.private_accessible(TorappuBuildingUI.SM.BuildingStationManageEditQueueState)
  self:Fix_ex(TorappuBuildingUI.SM.BuildingStationManageEditQueueState, "_InitIfNot", function(self)
    local ok, errorInfo = xpcall(Fix_BuildingStationManageEditQueueStateInitIfNot, debug.traceback, self)
    if not ok then
      LogError("[BuildingStationManageEditQueueStateHotfixer] fix _InitIfNot error:" .. errorInfo)
    end
  end)
  self:Fix_ex(CS.Torappu.Building.UI.Workshop.BuildingWorkshopWholeViewModel, "TryToSetWorkCount", function(self,count)
    local ok, value = xpcall(Fix_BuildingWorkShop_TryToSetWorkCount, debug.traceback, self,count)
    if not ok then
      LogError("[BuildingStationManageEditQueueStateHotfixer] fix TryToSetWorkCount error:" .. value)
      return self:TryToSetWorkCount(count)
    end
    return value
  end)
  xlua.private_accessible(CS.Torappu.Building.UI.Workshop.BuildingWorkshopHomeState)
  self:Fix_ex(CS.Torappu.Building.UI.Workshop.BuildingWorkshopHomeState, "OnIngredientJumpBtnPressed", function(self, index)
    local ok, errorInfo = xpcall(Fix_BuildingWorkShop_OnIngredientJumpBtnPressed, debug.traceback, self, index)
    if not ok then
      LogError("[BuildingStationManageEditQueueStateHotfixer] fix OnIngredientJumpBtnPressed error:" .. errorInfo)
    end
  end)
  xlua.private_accessible(TorappuBuildingUI.SM.StationManageUtil)
  self:Fix_ex(TorappuBuildingUI.SM.StationManageUtil, "GetPreQueueStatus", function(buildingModel, slotId, queue)
    local ok, value = xpcall(Fix_StationManage_GetPreQueueStatus, debug.traceback, buildingModel, slotId, queue)
    if not ok then
      LogError("fix StationManage GetPreQueueStatus error:" .. value)
      return TorappuBuildingUI.SM.StationManageUtil.GetPreQueueStatus(buildingModel, slotId, queue)
    end
    return value
  end)
  xlua.private_accessible(CS.Torappu.UI.Firework.FireworkCraft.FireworkCraftModel)
  self:Fix_ex(CS.Torappu.UI.Firework.FireworkCraft.FireworkCraftModel, "LoadData", function(self, input)
    local ok, value = xpcall(Fix_FireworkCraftModel_LoadData, debug.traceback, self, input)
    if not ok then
      LogError("fix FireworkCraftModel error:" .. value)
      self:LoadData(input)
    end
  end)
  xlua.private_accessible(CS.Torappu.Activity.Act1VAutoChess.Act1VAutoChessChessShopQuickAssistOnlyItemView.VirtualView)
  self:Fix_ex(CS.Torappu.Activity.Act1VAutoChess.Act1VAutoChessChessShopQuickAssistOnlyItemView.VirtualView, "TryRefreshAssistItemView", function(self, arg1)
    local ok, errorInfo = xpcall(Fix_Act1VAutoChessShopQuickAssist_TryRefreshNormalItemView, debug.traceback, self, arg1)
      if not ok then
         LogError("fix Act1VAutoChessChessShopQuickAssistOnlyItemView virtualView error" .. errorInfo)
      end
  end)
  xlua.private_accessible(CS.Torappu.Activity.Act1VAutoChess.Act1VAutoChessChessShopQuickAssistTitleWithItemView.VirtualView)
  self:Fix_ex(CS.Torappu.Activity.Act1VAutoChess.Act1VAutoChessChessShopQuickAssistTitleWithItemView.VirtualView, "TryRefreshAssistItemView", function(self, arg1)
    local ok, errorInfo = xpcall(Fix_Act1VAutoChessShopQuickAssist_TryRefreshTitleItemView, debug.traceback, self, arg1)
      if not ok then
         LogError("fix Act1VAutoChessChessShopQuickAssistTitleWithItemView virtualView error" .. errorInfo)
      end
  end)
end

return V056Hotfixer