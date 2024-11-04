local BuildingMeetingHomeStateHotfixer = Class("BuildingMeetingHomeStateHotfixer", HotfixBase)

local function _Fix_SetupView(self)
 	self:SetupView()
	
	local typeFont = typeof(CS.UnityEngine.Font)
	local typeText = typeof(CS.UnityEngine.UI.Text)
	local fontArial = CS.UnityEngine.Resources.GetBuiltinResource(typeFont, "Arial.ttf")
	local categories = CS.Torappu.GameObjectUtil.FindDeepChild(self.transform, "categories")
	if categories == nil then
		LogError("[Hotfix]nil value")
		return
	end
	local texts = categories:GetComponentsInChildren(typeText, true)
	for i = 0, texts.Length - 1 do
		local text = texts[i]
		if text == nil then
			LogError("[Hotfix]nil value")
			return
		end
		text.font = fontArial
	end
end

function BuildingMeetingHomeStateHotfixer:OnInit()
	xlua.private_accessible(CS.Torappu.Building.UI.Meeting.BuildingMeetingHomeState)
	self:Fix_ex(CS.Torappu.Building.UI.Meeting.BuildingMeetingHomeState, "SetupView", function(self)
        local ok, info = xpcall(_Fix_SetupView, debug.traceback, self)
        if not ok then
          LogError("[Hotfix] BuildingMeetingHomeStateHotfixer._Fix_SetupView fail : ".. info)
        end
      end)
end

function BuildingMeetingHomeStateHotfixer:OnDispose()
end

return BuildingMeetingHomeStateHotfixer
