








UIBase = Class("UIBase");



function UIBase:Initialize(gobj, parent)
  self.m_destroyed = false;
  self.m_rootDestroying = false;
  self.m_parent = parent;
  self.m_root = gobj;
  self.m_layout = gobj:GetComponent("Torappu.Lua.LuaLayout");
  local this = self;
  self.m_layout:TraverseCtrlDefines(function(name, ctrl)
    this["_"..name] = ctrl;
  end);
  self.m_layout:TraverseValueDefines(function(name, value)
    this["_"..name] = value
  end)

  self:OnInitialize();
  self.m_layout:BindLayoutEventListener(self);
end

function UIBase:Dispose()
  if self.m_destroyed then
    return;
  end
  if not self.m_rootDestroying then
    self.m_layout:BindLayoutEventListener(nil);
  end

  self:OnDispose();

  if self.m_allCustomComponents then
    for _, com in ipairs(self.m_allCustomComponents) do
        if com.Dispose then
            com:Dispose();
        end
    end
  end

  if self.m_doWhenClose then
    for _, func in ipairs(self.m_doWhenClose) do
      func();
    end
    self.m_doWhenClose = nil;
  end

  if self.m_allTimer then
    for index, timer in ipairs(self.m_allTimer) do
      TimerModel.me:Destroy(timer);
    end
    self.m_allTimer = nil;
  end

  self.m_destroyed = true;

  if not self.m_rootDestroying then
    CS.UnityEngine.GameObject.Destroy(self.m_root);
  end

end


function UIBase:OnInitialize()
end


function UIBase:OnDispose()
end


function UIBase:OnVisible(v)
end

function UIBase:RootGameObject()
    return self.m_root;
end


function UIBase:OnResume()
end


function UIBase:OnEnter()
end


function UIBase:OnExit()
end

function UIBase:IsDestroy()
    return self.m_destroyed;
end




function UIBase:AddButtonClickListener(btn, func, ...)
    if type(btn) == "string" then
        btn = self:GetButton(btn);
    end
    if not btn then
        return;
    end
    local args = {...};
    local this = self;
    btn.onClick:AddListener( function()
        func(this, table.unpack(args));
    end);

    self:_AddToDoWhenClose(function()
        if not CS.Torappu.Lua.Util.IsDestroyed(btn) then
            btn.onClick:RemoveAllListeners();
            btn.onClick:Invoke();
        end
    end);
end








function UIBase:AsignDelegate(obj, delegateName, func, ...)
    local args = {...}
    local this = self;
    obj[delegateName] = function(...)
        local params = {...}
        if #params < 1 then
            params = args;
        elseif #args > 0 then
            for _, v in ipairs(args) do
                table.insert(params, v);
            end
        end
        
        func(this, table.unpack(params));
    end
    
    self:_AddToDoWhenClose(function()
        if not CS.Torappu.Lua.Util.IsDestroyed(obj) then
            obj[delegateName] = nil;
        end
    end);
end


function UIBase:_AddToDoWhenClose(func)
    if not func then
        return;
    end
    if not self.m_doWhenClose then
        self.m_doWhenClose = {};
    end
    table.insert(self.m_doWhenClose, func);
end


function UIBase:Delay(delay, func)
    local timer = TimerModel.me:Delay(delay, Event.Create(self, func));
    self:_RecordTimer(timer);
    return timer;
end

function UIBase:Interval(interval, loop, func)
    local timer = TimerModel.me:Interval(interval, loop, Event.Create(self, func));
    self:_RecordTimer(timer);
    return timer;
end

function UIBase:Frame(loop, func, ...)
    local timer = TimerModel.me:Frame(loop, Event.Create(self, func, ...));
    self:_RecordTimer(timer);
    return timer;
end

function UIBase:NextFrame(func)
    local timer = TimerModel.me:NextFrame(Event.Create(self, func));
    self:_RecordTimer(timer);
    return timer;
end

function UIBase:DestroyTimer(timer)
    TimerModel.me:Destroy(timer);
    if self.m_allTimer then
        for idx, v in ipairs(self.m_allTimer) do
            if v == timer then
                table.remove(self.m_allTimer, idx);
            end
        end
    end
end


function UIBase:_RecordTimer(timer)
    if not self.m_allTimer then
        self.m_allTimer = {};
    end
    table.insert(self.m_allTimer, timer);
end


function UIBase:OpenPage(pageName, openType, options)
    CS.Torappu.UI.UIPageController.OpenPage(pageName, openType, options)
end





function UIBase:OpenPage1(pageName)
    CS.Torappu.UI.UIPageController.OpenPage(pageName)
end




function UIBase:OpenPage2(pageName, openType)
    CS.Torappu.UI.UIPageController.OpenPage(pageName, openType)
end




function UIBase:OpenPage3(pageName, options)
    CS.Torappu.UI.UIPageController.OpenPage(pageName, options)
end






function UIBase:CreateCustomComponent(comCls, ...)
    if not self.m_allCustomComponents then
        self.m_allCustomComponents = {};
    end
    local com = comCls.new();
    com:Initialize(...);
    table.insert(self.m_allCustomComponents, com);
    return com;
end


function UIBase:OnEnable()
    self:OnVisible(true);
end


function UIBase:OnDisable()
    self:OnVisible(false);
end


function UIBase:OnDestroy()
    self.m_rootDestroying = true;
    self:Dispose();
end