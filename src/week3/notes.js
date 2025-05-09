import '//unpkg.com/mathlive'

export const Notes = () => {
  return <div style={{
    display: "inline-block",
    alignSelf: "flex-start"
  }}>
    <h3>Notes</h3>
    <div>
      <div style={{
        width: "512px"
      }}>
        <div>
          <label>For line to be tangent:</label>
          <math-field
            width="256"
            style={{
              width: "256px"
            }}
          >
            $$ c^2=a^2m^2+b^2 $$
          </math-field>
        </div>
        <div>
          <label>Tangent to ellipse centered at origin:</label>
          <math-field
            value="$$ y=mx\pm\sqrt{a^2m^2+b^2} $$"
          >
          </math-field>
        </div>
        <math-field
          value="$$ \frac{(x-h)cos\left(\alpha)+\left(y-k\right)\sin\left(\alpha\right)\right)^2}{a^2}+\frac{(x-h)\sin\left(\alpha)-\left(y-k\right)\cos\left(\alpha\right)\right)^2}{b^2}=1 $$"
          style={{
          }}
        >
        </math-field>
        <math-field
          value="$$ \frac{\left(x-h\right)\left(b^2\cos^2\alpha+a^2\sin^2\alpha\right)+\left(y-k\right)\sin\alpha\cos\alpha\left(b^2-a^2\right)}{\left(x-h\right)\sin\alpha\cos\alpha\left(a^2-b^2\right)-\left(y-k\right)\left(a^2\cos^2\alpha+b^2\sin^2\alpha\right)}=\frac{y}{dx} $$"
          style={{
          }}
        >
        </math-field>
      </div>
    </div>
  </div>
}
