function RenderChain(){
    var passes = [];
    var head = null, tail = null, current = null;

    this.AddRenderPass = function( pass ){
        passes.push( pass );
        if(!head){
            head = pass;
            tail = head;
        }else{
            pass.prev = tail;
            tail.next = pass;
            tail = pass;
        }
    };

    this.Render = function(){
        current = head;
        while(current){
            current.render();
            current = current.next;
        }
    };
};
OMEGA.Omega3D.RenderChain = RenderChain;
