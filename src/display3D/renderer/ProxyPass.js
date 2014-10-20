function ProxyPass(target, proxy, args ){
    Pass.apply(this);
    this.next = null;this.prev = null;
    this.target = target;
    this.proxy  = proxy;
    this.args   = args || null;
    this.render = function(){ this.proxy.apply(this.target,this.args);};
};
RenderPass.prototype = new Pass();
OMEGA.Omega3D.ProxyPass = ProxyPass;
